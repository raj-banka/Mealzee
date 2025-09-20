-- Migration: reset_schema (generated from prisma migrate diff)
-- Date: 2025-09-20

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "gender" TEXT,
    "dob" TEXT,
    "referralCode" TEXT NOT NULL,
    "referredByCode" TEXT,
    "referralName" TEXT,
    "referralCount" INTEGER NOT NULL DEFAULT 0,
    "referredUsers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "addresses" JSONB NOT NULL DEFAULT '[]',
    "dietaryPref" TEXT,
    "sector" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Order table
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "deliveryDate" TEXT,
    "deliverySlot" JSONB,
    "deliveryAddress" JSONB,
    "paymentMethod" JSONB,
    "subtotal" DOUBLE PRECISION,
    "deliveryFee" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "specialInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- Foreign keys
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
