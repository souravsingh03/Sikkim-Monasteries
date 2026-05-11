const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Server error' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  login: (employeeId: string, password: string, role: string) =>
    request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ employeeId, password, role }),
    }),

  signup: (data: {
    employeeId: string;
    name: string;
    password: string;
    role: string;
    department: string;
  }) => request<any>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  getHospitals: () => request<any[]>('/hospitals'),
  createTrip:   (data: any) => request<any>('/trips', { method: 'POST', body: JSON.stringify(data) }),
  getTrips:     () => request<any[]>('/trips'),
  getTollAlerts: () => request<any[]>('/tolls/alerts'),
};
