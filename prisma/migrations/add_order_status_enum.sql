-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CREATED', 'PAID', 'SUCCEEDED', 'RECEIVED', 'IN_PROGRESS', 'READY', 'SHIPPED', 'DELIVERED', 'FINISHED', 'FAILED', 'REFUNDED', 'CANCELLED');

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus" USING 
  CASE 
    WHEN "status" = 'created' THEN 'CREATED'::"OrderStatus"
    WHEN "status" = 'paid' THEN 'PAID'::"OrderStatus"
    WHEN "status" = 'succeeded' THEN 'SUCCEEDED'::"OrderStatus"
    WHEN "status" = 'ready' THEN 'READY'::"OrderStatus"
    WHEN "status" = 'shipped' THEN 'SHIPPED'::"OrderStatus"
    WHEN "status" = 'finished' THEN 'FINISHED'::"OrderStatus"
    WHEN "status" = 'failed' THEN 'FAILED'::"OrderStatus"
    WHEN "status" = 'refunded' THEN 'REFUNDED'::"OrderStatus"
    WHEN "status" = 'cancelled' THEN 'CANCELLED'::"OrderStatus"
    ELSE 'CREATED'::"OrderStatus"
  END;

-- Set default value
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'CREATED'; 