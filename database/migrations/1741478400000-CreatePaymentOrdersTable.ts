import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreatePaymentOrdersTable1741478400000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payment_orders',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'order_code',
            type: 'varchar',
            length: '64',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'provider',
            type: 'varchar',
            length: '32',
            isNullable: true,
            default: null,
          },
          {
            name: 'provider_order_id',
            type: 'varchar',
            length: '128',
            isNullable: true,
            default: null,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '10',
            isNullable: false,
            default: "'VND'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['CREATED', 'PENDING', 'PAID', 'FAILED', 'CANCELED'],
            isNullable: false,
            default: "'CREATED'",
          },
          {
            name: 'customer_id',
            type: 'varchar',
            length: '64',
            isNullable: true,
            default: null,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
            default: null,
          },
          {
            name: 'metadata',
            type: 'json',
            isNullable: true,
            default: null,
          },
          {
            name: 'paid_at',
            type: 'datetime',
            isNullable: true,
            default: null,
          },
          {
            name: 'created_at',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          new TableIndex({
            name: 'idx_payment_orders_status',
            columnNames: ['status'],
          }),
          new TableIndex({
            name: 'idx_payment_orders_customer_id',
            columnNames: ['customer_id'],
          }),
          new TableIndex({
            name: 'idx_payment_orders_created_at',
            columnNames: ['created_at'],
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payment_orders', true);
  }
}
