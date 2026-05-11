export enum ViewMode {
  AMBULANCE = 'AMBULANCE',
  HOSPITAL  = 'HOSPITAL',
  TOLL      = 'TOLL',
}

export enum Severity {
  CRITICAL = 'CRITICAL',
  MODERATE = 'MODERATE',
  STABLE   = 'STABLE',
}

export type UserRole = 'PARAMEDIC' | 'HOSPITAL_ADMIN' | 'TOLL_OPERATOR';

export interface User {
  id: string;
  name: string;
  employeeId: string;
  role: UserRole;
  department: string;
}

export interface PatientData {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  symptoms: string;
  vitals: string;
}

export interface TriageResult {
  severity: Severity;
  summary: string;
  recommended_specialists: string[];
  equipment_needed: string[];
}

export interface Hospital {
  id: string;
  name: string;
  distanceKm: number;
  etaMinutes: number;
  specialties: string[];
  capacity: number;
  occupied: number;
  address: string;
  phone: string;
}

export interface LiveVitals {
  heartRate: number;
  spo2: number;
  bpSystolic: number;
  bpDiastolic: number;
  lastUpdated: number;
}

export interface ActiveTrip {
  id: string;
  ambulanceId: string;
  hospitalId: string;
  hospitalName: string;
  patientData: PatientData;
  triageResult: TriageResult;
  startTime: number;
  initialEtaMinutes: number;
  currentEtaMinutes: number;
  progress: number;
  status: 'EN_ROUTE' | 'ARRIVED';
  liveVitals: LiveVitals;
  paramedicName: string;
}

export interface TollAlert {
  id: string;
  tollName: string;
  ambulanceId: string;
  lane: string;
  timestamp: number;
  cleared: boolean;
  destination: string;
  patientSeverity: Severity;
}
