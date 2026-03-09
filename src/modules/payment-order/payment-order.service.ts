import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaginatedResponseDto } from '../../common/dto/pagination-response.dto';
import { SingleResponseDto } from '../../common/dto/single-response.dto';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { QueryPaymentOrderDto } from './dto/query-payment-order.dto';
import { PaymentOrder } from './entities/payment-order.entity';
import { PaymentOrderStatus } from './enums/payment-order-status.enum';

@Injectable()
export class PaymentOrderService {
  constructor(
    @InjectRepository(PaymentOrder)
    private readonly paymentOrderRepository: Repository<PaymentOrder>,
  ) {}

  async create(
    dto: CreatePaymentOrderDto,
  ): Promise<SingleResponseDto<PaymentOrder>> {
    const existing = await this.paymentOrderRepository.findOne({
      where: { orderCode: dto.orderCode },
    });

    if (existing) {
      throw new ConflictException(
        `Payment order with orderCode "${dto.orderCode}" already exists`,
      );
    }

    const order = this.paymentOrderRepository.create({
      orderCode: dto.orderCode,
      amount: dto.amount.toString(),
      currency: dto.currency ?? 'VND',
      customerId: dto.customerId ?? null,
      description: dto.description ?? null,
      metadata: dto.metadata ?? null,
      // Server-controlled fields — never set by client
      status: PaymentOrderStatus.CREATED,
      provider: null,
      providerOrderId: null,
      paidAt: null,
    });

    const saved = await this.paymentOrderRepository.save(order);

    return new SingleResponseDto(saved);
  }

  async findAll(
    query: QueryPaymentOrderDto,
  ): Promise<PaginatedResponseDto<PaymentOrder>> {
    const { page, limit, status, orderCode, customerId } = query;

    const qb = this.paymentOrderRepository
      .createQueryBuilder('po')
      .orderBy('po.createdAt', 'DESC');

    if (status) {
      qb.andWhere('po.status = :status', { status });
    }

    if (orderCode) {
      qb.andWhere('po.orderCode LIKE :orderCode', {
        orderCode: `%${orderCode}%`,
      });
    }

    if (customerId) {
      qb.andWhere('po.customerId = :customerId', { customerId });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  /**
   * Finds a payment order by orderCode.
   * Throws NotFoundException if not found.
   * Used internally by other modules (e.g. SepayModule).
   */
  async findByOrderCode(orderCode: string): Promise<PaymentOrder> {
    const order = await this.paymentOrderRepository.findOne({
      where: { orderCode },
    });

    if (!order) {
      throw new NotFoundException(
        `Payment order with orderCode "${orderCode}" not found`,
      );
    }

    return order;
  }

  /**
   * Updates the status of a payment order by ID.
   * Used internally for status transitions triggered by payment gateway events.
   */
  async updateStatus(id: number, status: PaymentOrderStatus): Promise<void> {
    await this.paymentOrderRepository.update({ id }, { status });
  }

  /**
   * Atomically marks an order as PAID only if it is currently CREATED or PENDING.
   * Returns true if the row was updated, false if the order had already transitioned.
   */
  async markAsPaid(
    id: number,
    details: { provider: string; providerOrderId: string; paidAt: Date },
  ): Promise<boolean> {
    const result = await this.paymentOrderRepository.update(
      {
        id,
        status: In([PaymentOrderStatus.CREATED, PaymentOrderStatus.PENDING]),
      },
      {
        status: PaymentOrderStatus.PAID,
        provider: details.provider,
        providerOrderId: details.providerOrderId,
        paidAt: details.paidAt,
      },
    );

    return (result.affected ?? 0) > 0;
  }
}
