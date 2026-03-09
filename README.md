# sepay-integration

PaymentOrder management service — ready for Sepay gateway integration.

## Prerequisites

- Node.js >= 18
- MySQL 8.x
- npm

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your local MySQL credentials.

### 3. Create the database in MySQL

Before running migrations, the database must exist:

```sql
CREATE DATABASE sepay_integration CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or via the CLI:

```bash
mysql -u root -p -e "CREATE DATABASE sepay_integration CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 4. Run migrations

```bash
npm run migration:run
```

### 5. Start the app

```bash
npm run start:dev
```

App runs at `http://localhost:3000` (or the port set in `.env`).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled output |
| `npm run migration:run` | Apply pending migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run migration:generate -- --name=MigrationName` | Auto-generate migration from entity diff |
| `npm run migration:create -- --name=MigrationName` | Create a blank migration file |

> **Note on `migration:generate`**: on Windows use `--name=MigrationName` syntax.
> On Linux/macOS you can also use `npm run migration:generate --name=MigrationName`.

---

## Seed data

Insert sample rows for local testing:

```bash
mysql -u root -p sepay_integration < scripts/seed.sql
```

This inserts 5 payment orders across all statuses.

---

## API

### GET /payment-orders

List payment orders with pagination and optional filters.

**Query params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page (max 100) |
| `status` | string | — | Filter by status (`CREATED`, `PENDING`, `PAID`, `FAILED`, `CANCELED`) |
| `orderCode` | string | — | Partial match on orderCode |
| `customerId` | string | — | Exact match on customerId |

**Example request:**

```bash
curl -X GET "http://localhost:3000/payment-orders?page=1&limit=20"
```

**With filters:**

```bash
curl -X GET "http://localhost:3000/payment-orders?status=PAID&customerId=CUS_001"
```

**Example response:**

```json
{
  "data": [
    {
      "id": 1,
      "orderCode": "PO_20260309_001",
      "provider": null,
      "providerOrderId": null,
      "amount": "100000.00",
      "currency": "VND",
      "status": "CREATED",
      "customerId": "CUS_001",
      "description": "Test payment order #1",
      "metadata": null,
      "paidAt": null,
      "createdAt": "2026-03-09T00:00:00.000Z",
      "updatedAt": "2026-03-09T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## Folder Structure

```
├── database/
│   ├── data-source.ts          # TypeORM DataSource for CLI migrations
│   └── migrations/             # Migration files
├── scripts/
│   └── seed.sql                # Sample data for local testing
└── src/
    ├── common/
    │   └── dto/
    │       └── pagination-response.dto.ts
    ├── config/
    │   └── database.config.ts  # DB config loaded from .env
    ├── modules/
    │   └── payment-order/
    │       ├── dto/
    │       │   └── query-payment-order.dto.ts
    │       ├── entities/
    │       │   └── payment-order.entity.ts
    │       ├── enums/
    │       │   └── payment-order-status.enum.ts
    │       ├── payment-order.controller.ts
    │       ├── payment-order.service.ts
    │       └── payment-order.module.ts
    ├── app.module.ts
    └── main.ts
```

---

## Future: Sepay Integration

The `PaymentOrder` entity already has `provider` and `providerOrderId` fields reserved for gateway use.

To integrate Sepay later:
1. Create `src/modules/sepay/` with a `SepayService`
2. Inject `PaymentOrderService` from `PaymentOrderModule` (already exported)
3. Add a `SepayModule` and import it in `AppModule`

No refactoring of the existing `PaymentOrderModule` will be needed.
