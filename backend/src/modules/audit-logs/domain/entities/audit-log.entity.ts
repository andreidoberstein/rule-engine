export class AuditLogEntity {
  id: string;
  entity_name: string;
  entity_id: string;
  action: string;
  old_data?: any;
  new_data?: any;
  user_id: string;
  user?: any;
  created_at: Date;
}
