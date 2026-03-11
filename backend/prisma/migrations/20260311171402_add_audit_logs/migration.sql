-- AlterTable
ALTER TABLE "budgets" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "entity_name" VARCHAR(255) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
