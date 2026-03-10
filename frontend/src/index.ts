export interface User {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'worker';
  avatar?: string;
  companyName?: string;
  office_location?: string;
  working_hours?: string;
}

export interface AuditLog {
  id: number;
  action: string;
  details: Record<string, { old: any; new: any }>;
  created_at: string;
}