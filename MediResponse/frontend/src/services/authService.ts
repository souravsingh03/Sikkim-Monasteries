import { User, UserRole } from '../types';

// Demo credentials — replace with real Spring Boot /api/auth/login calls in production
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'AMB-001': {
    password: 'demo123',
    user: {
      id: 'u1',
      name: 'Rajesh Kumar',
      employeeId: 'AMB-001',
      role: 'PARAMEDIC',
      department: 'Ambulance Unit 4',
    },
  },
  'HOSP-001': {
    password: 'demo123',
    user: {
      id: 'u2',
      name: 'Dr. Priya Singh',
      employeeId: 'HOSP-001',
      role: 'HOSPITAL_ADMIN',
      department: 'Emergency Medicine',
    },
  },
  'TOLL-001': {
    password: 'demo123',
    user: {
      id: 'u3',
      name: 'Anil Sharma',
      employeeId: 'TOLL-001',
      role: 'TOLL_OPERATOR',
      department: 'Highway Control',
    },
  },
};

export interface LoginResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export const loginUser = async (
  employeeId: string,
  password: string
): Promise<LoginResult> => {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 900));

  const record = DEMO_USERS[employeeId.toUpperCase()];
  if (!record) return { success: false, error: 'Employee ID not found in system.' };
  if (record.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };

  const token = `mlr_${Math.random().toString(36).substr(2, 20)}`;
  return { success: true, user: record.user, token };
};

export const getRoleDepartment = (role: UserRole): string => {
  const map: Record<UserRole, string> = {
    PARAMEDIC:      'Ambulance Unit',
    HOSPITAL_ADMIN: 'Hospital Admin',
    TOLL_OPERATOR:  'Toll Control',
  };
  return map[role];
};
