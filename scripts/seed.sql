-- Seed data for local development testing
-- Run after migration:run: mysql -u <user> -p <db_name> < scripts/seed.sql

INSERT INTO `payment_orders`
  (`order_code`, `provider`, `provider_order_id`, `amount`, `currency`, `status`, `customer_id`, `description`, `metadata`, `paid_at`, `created_at`, `updated_at`)
VALUES
  ('PO_20260309_001', NULL, NULL, 100000.00, 'VND', 'CREATED',  'CUS_001', 'Test payment order #1', NULL, NULL, NOW(), NOW()),
  ('PO_20260309_002', NULL, NULL, 250000.00, 'VND', 'PENDING',  'CUS_002', 'Test payment order #2', NULL, NULL, NOW(), NOW()),
  ('PO_20260309_003', NULL, NULL, 500000.00, 'VND', 'PAID',     'CUS_001', 'Test payment order #3', NULL, NOW(), NOW(), NOW()),
  ('PO_20260309_004', NULL, NULL,  75000.00, 'VND', 'FAILED',   'CUS_003', 'Test payment order #4', NULL, NULL, NOW(), NOW()),
  ('PO_20260309_005', NULL, NULL, 120000.00, 'VND', 'CANCELED', 'CUS_002', 'Test payment order #5', NULL, NULL, NOW(), NOW());
