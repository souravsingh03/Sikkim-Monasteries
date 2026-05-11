import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/shared/Layout';
import LoginView from './components/shared/LoginView';
import AmbulanceView from './components/ambulance/AmbulanceView';
import HospitalView from './components/hospital/HospitalView';
import TollView from './components/toll/TollView';
import {
  ViewMode, Hospital, ActiveTrip, PatientData,
  TriageResult, TollAlert, User, Severity,
} from './types';

// ── Static hospital data (replace with Spring Boot /api/hospitals in production) ──
const HOSPITALS: Hospital[] = [
  {
    id: 'h1', name: 'AIIMS Trauma Centre',
    distanceKm: 4.2, etaMinutes: 12,
    specialties: ['Trauma L1', 'Cardiology', 'Neurology', 'Burns'],
    capacity: 400, occupied: 78,
    address: 'Ring Road, New Delhi', phone: '011-26593200',
  },
  {
    id: 'h2', name: 'Safdarjung Hospital',
    distanceKm: 6.8, etaMinutes: 17,
    specialties: ['General Surgery', 'Orthopaedics', 'Neurosurgery'],
    capacity: 350, occupied: 62,
    address: 'Ansari Nagar West, New Delhi', phone: '011-26707444',
  },
  {
    id: 'h3', name: 'Apollo Hospitals',
    distanceKm: 9.1, etaMinutes: 22,
    specialties: ['Cardiology', 'Vascular Surgery', 'Oncology'],
    capacity: 250, occupied: 55,
    address: 'Sarita Vihar, New Delhi', phone: '011-29871090',
  },
  {
    id: 'h4', name: 'Ram Manohar Lohia Hospital',
    distanceKm: 2.5, etaMinutes: 8,
    specialties: ['General Medicine', 'Paediatrics', 'ENT'],
    capacity: 300, occupied: 88,
    address: 'Park Street, New Delhi', phone: '011-23365525',
  },
];

const TOLL_NAMES = [
  'NH-44 Toll Plaza',
  'Yamuna Expressway Gate',
  'NH-58 Meerut Bypass',
  'Delhi-Noida Toll',
];

const App: React.FC = () => {
  const [user, setUser]               = useState<User | null>(null);
  const [token, setToken]             = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.AMBULANCE);
  const [activeTrips, setActiveTrips] = useState<ActiveTrip[]>([]);
  const [tollAlerts, setTollAlerts]   = useState<TollAlert[]>([]);

  // ── Live vitals simulation ─────────────────────────────────────────────────
  useEffect(() => {
    if (activeTrips.length === 0) return;
    const interval = setInterval(() => {
      setActiveTrips(prev => prev.map(trip => {
        if (trip.status === 'ARRIVED') return trip;
        const newEta   = Math.max(0, trip.currentEtaMinutes - (2 / 60));
        const progress = Math.min(100, ((trip.initialEtaMinutes - newEta) / trip.initialEtaMinutes) * 100);
        const isCritical = trip.triageResult.severity === Severity.CRITICAL;
        const v = isCritical ? 4 : 2;
        const newHR  = Math.min(160, Math.max(50, trip.liveVitals.heartRate + (Math.floor(Math.random() * v) - v / 2)));
        const newSp2 = Math.min(100, Math.max(isCritical ? 82 : 94,
          trip.liveVitals.spo2 + (Math.random() > 0.85 ? -1 : Math.random() > 0.85 ? 1 : 0)));
        return {
          ...trip,
          currentEtaMinutes: parseFloat(newEta.toFixed(1)),
          progress,
          status: newEta <= 0 ? 'ARRIVED' : 'EN_ROUTE',
          liveVitals: {
            ...trip.liveVitals,
            heartRate: Math.round(newHR),
            spo2: Math.round(newSp2),
            lastUpdated: Date.now(),
          },
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeTrips.length]);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const handleLogin = (loggedInUser: User, authToken: string) => {
    setUser(loggedInUser);
    setToken(authToken);
    if (loggedInUser.role === 'PARAMEDIC')           setCurrentView(ViewMode.AMBULANCE);
    else if (loggedInUser.role === 'HOSPITAL_ADMIN') setCurrentView(ViewMode.HOSPITAL);
    else if (loggedInUser.role === 'TOLL_OPERATOR')  setCurrentView(ViewMode.TOLL);
  };

  const handleLogout = () => { setUser(null); setToken(null); };

  // ── Dispatch ───────────────────────────────────────────────────────────────
  const handleStartTrip = useCallback(
    (hospitalId: string, patientData: PatientData, triage: TriageResult) => {
      const hospital = HOSPITALS.find(h => h.id === hospitalId);
      if (!hospital || !user) return;

      const ambulanceId = `AMB-${Math.floor(Math.random() * 900) + 100}`;
      const tripId      = Math.random().toString(36).substr(2, 9);

      const newTrip: ActiveTrip = {
        id: tripId, ambulanceId, hospitalId,
        hospitalName: hospital.name, patientData, triageResult: triage,
        startTime: Date.now(),
        initialEtaMinutes: hospital.etaMinutes,
        currentEtaMinutes: hospital.etaMinutes,
        progress: 0, status: 'EN_ROUTE',
        paramedicName: user.name,
        liveVitals: {
          heartRate:   triage.severity === Severity.CRITICAL ? 115 : 88,
          spo2:        triage.severity === Severity.CRITICAL ? 91  : 98,
          bpSystolic:  triage.severity === Severity.CRITICAL ? 90  : 120,
          bpDiastolic: triage.severity === Severity.CRITICAL ? 60  : 80,
          lastUpdated: Date.now(),
        },
      };

      setActiveTrips(prev => [newTrip, ...prev]);

      const tollAlert: TollAlert = {
        id: Math.random().toString(36).substr(2, 9),
        tollName: TOLL_NAMES[Math.floor(Math.random() * TOLL_NAMES.length)],
        ambulanceId, lane: 'Emergency Lane 1',
        timestamp: Date.now(), cleared: false,
        destination: hospital.name, patientSeverity: triage.severity,
      };
      setTollAlerts(prev => [tollAlert, ...prev]);
    },
    [user],
  );

  const handleClearAlert = useCallback((id: string) => {
    setTollAlerts(prev => prev.map(a => a.id === id ? { ...a, cleared: true } : a));
  }, []);

  if (!user) return <LoginView onLogin={handleLogin} />;

  return (
    <Layout currentView={currentView} setView={setCurrentView} onLogout={handleLogout} user={user}>
      {user.role === 'PARAMEDIC' && (
        <AmbulanceView onStartTrip={handleStartTrip} hospitals={HOSPITALS} user={user} />
      )}
      {user.role === 'HOSPITAL_ADMIN' && (
        <HospitalView incomingTrips={activeTrips} />
      )}
      {user.role === 'TOLL_OPERATOR' && (
        <TollView alerts={tollAlerts} onClearAlert={handleClearAlert} />
      )}
    </Layout>
  );
};

export default App;
