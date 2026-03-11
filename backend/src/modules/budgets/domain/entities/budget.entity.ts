export class BudgetEntity {
  id: string;
  client_id: string;
  status: string;
  dates?: string;
  total: number;
  client?: any;
  roles?: any[];
  created_by?: any;
  created_at: Date;
  updated_at: Date;
}
