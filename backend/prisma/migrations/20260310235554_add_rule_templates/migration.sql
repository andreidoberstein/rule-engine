-- CreateTable
CREATE TABLE "rule_templates" (
    "id" UUID NOT NULL,
    "client_id" UUID,
    "state_uf" VARCHAR(2),
    "verba_type_id" UUID NOT NULL,
    "calc_type" TEXT NOT NULL DEFAULT 'FIXED',
    "value" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "text_value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rule_templates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rule_templates" ADD CONSTRAINT "rule_templates_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rule_templates" ADD CONSTRAINT "rule_templates_verba_type_id_fkey" FOREIGN KEY ("verba_type_id") REFERENCES "verba_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
