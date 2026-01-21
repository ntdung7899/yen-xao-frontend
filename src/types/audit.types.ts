// Audit Log Types

export type AuditAction = 
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'transfer'
  | 'export'
  | 'access_denied';

export type AuditEntity = 
  | 'customer'
  | 'employee'
  | 'department'
  | 'user'
  | 'team'
  | 'system';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  entityName?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  success: boolean;
}
