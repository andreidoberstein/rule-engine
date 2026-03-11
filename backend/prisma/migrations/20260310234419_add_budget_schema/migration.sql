-- CreateTable
CREATE TABLE "areas" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_types" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "area_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verba_groups" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verba_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verba_types" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "group_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verba_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "dates" VARCHAR(255),
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_roles" (
    "id" UUID NOT NULL,
    "budget_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "state_uf" VARCHAR(2) NOT NULL,
    "headcount" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_verbas" (
    "id" UUID NOT NULL,
    "budget_role_id" UUID NOT NULL,
    "verba_type_id" UUID NOT NULL,
    "calc_type" TEXT NOT NULL DEFAULT 'FIXED',
    "value" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "text_value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_verbas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "areas_name_key" ON "areas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_types_name_key" ON "role_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "verba_groups_name_key" ON "verba_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "verba_types_name_key" ON "verba_types"("name");

-- AddForeignKey
ALTER TABLE "role_types" ADD CONSTRAINT "role_types_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verba_types" ADD CONSTRAINT "verba_types_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "verba_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_roles" ADD CONSTRAINT "budget_roles_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budgets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_roles" ADD CONSTRAINT "budget_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_verbas" ADD CONSTRAINT "budget_verbas_budget_role_id_fkey" FOREIGN KEY ("budget_role_id") REFERENCES "budget_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_verbas" ADD CONSTRAINT "budget_verbas_verba_type_id_fkey" FOREIGN KEY ("verba_type_id") REFERENCES "verba_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
