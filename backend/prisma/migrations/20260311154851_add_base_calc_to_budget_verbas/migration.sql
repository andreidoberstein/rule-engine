-- AlterTable
ALTER TABLE "budget_verbas" ADD COLUMN     "base_calc_type" TEXT NOT NULL DEFAULT 'FIXED',
ADD COLUMN     "base_value" DECIMAL(10,2) NOT NULL DEFAULT 0.0;
