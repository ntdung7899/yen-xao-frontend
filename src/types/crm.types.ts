// CRM Types

export type CustomerStatus = 'lead' | 'prospect' | 'customer' | 'inactive';
export type CustomerPriority = 'low' | 'medium' | 'high' | 'vip';

export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: CustomerStatus;
  priority: CustomerPriority;
  assignedTo: string; // User ID
  assignedToName: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes?: string;
  totalValue: number; // Tổng giá trị giao dịch
}

export interface CustomerHistory {
  id: string;
  customerId: string;
  action: 'created' | 'updated' | 'transferred' | 'status_changed' | 'note_added';
  description: string;
  performedBy: string;
  performedByName: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface CustomerTransfer {
  customerId: string;
  fromUserId: string;
  toUserId: string;
  reason: string;
  timestamp: string;
}

export interface Team {
  id: string;
  name: string;
  managerId: string;
  memberIds: string[];
  description?: string;
}
