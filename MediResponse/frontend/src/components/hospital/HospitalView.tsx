import React, { useState } from 'react';
import { ActiveTrip, Severity } from '../../types';
import { Clock, AlertCircle, Ambulance, Activity, Heart, Wind, Gauge, CheckCircle2, MapPin, Phone } from 'lucide-react';

interface HospitalViewProps {
  incomingTrips: ActiveTrip[];
}

const severityConfig: Record<Severity, { badge: string; bar: string; label: string }> = {
  CRITICAL: { badge: 'bg-red-600 text-white',     bar: 'bg-red-500',     label: 'Critical' },
  MODERATE: { badge: 'bg-amber-500 text-white',    bar: 'bg-amber-400',   label: 'Moderate' },
  STABLE:   { badge: 'bg-emerald-600 text-white',  bar: 'bg-emerald-400', label: 'Stable'   },
};

const VitalBox: React.FC<{ label: string; value: string | number; unit: string; icon: React.ReactNode; color: string }> =
  ({ label, value, unit, icon, color }) => (
    <div className={`bg-slate-900 rounded-xl p-3 text-center flex flex-col items-center`}>
      <div className={`${color} mb-1`}>{icon}</div>
      <div className={`text-xl font-mono font-bold ${color} leading-none`}>{value}</div>
      <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{unit}</div>
      <div className="text-[9px] text-slate-600 mt-0.5">{label}</div>
    </div>
  );

const HospitalView: React.FC<HospitalViewProps> = ({ incomingTrips }) => {
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const critical = incomingTrips.filter(t => t.triageResult.severity === Severity.CRITICAL).length;
  const moderate  = incomingTrips.filter(t => t.triageResult.severity === Severity.MODERATE).length;
  const stable    = incomingTrips.filter(t => t.triageResult.severity === Severity.STABLE).length;
  const enRoute   = incomingTrips.filter(t => t.status === 'EN_ROUTE').length;

  if (incomingTrips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[55vh] text-slate-400 text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <Ambulance size={36} className="opacity-30" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600">No Incoming Patients</h3>
        <p className="text-sm mt-1">Emergency bay is clear. Awaiting dispatch alerts.</p>
        <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
          <CheckCircle2 size={14} /> All Systems Ready
        </div>
      </div>
    );
  }

  const selectedTripData = incomingTrips.find(t => t.id === selectedTrip);

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Incoming', value: incomingTrips.length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Critical', value: critical, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
          { label: 'Moderate', value: moderate, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
          { label: 'En Route', value: enRoute, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
        ].map(s => (
          <div key={s.label} className={`border rounded-xl px-4 py-3 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Incoming Patients ({incomingTrips.length})</h2>
        <span className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> LIVE FEED
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {incomingTrips.map(trip => {
          const sc = severityConfig[trip.triageResult.severity];
          const isExpanded = selectedTrip === trip.id;
          return (
            <div
              key={trip.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                trip.triageResult.severity === Severity.CRITICAL ? 'border-red-200' : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">{trip.ambulanceId}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${sc.badge}`}>{sc.label}</span>
                    </div>
                    <h3 className="font-bold text-slate-900">{trip.patientData.name || 'Unknown Patient'}</h3>
                    <p className="text-xs text-slate-500">
                      {trip.patientData.age}yr · {trip.patientData.gender} · Blood: <span className="font-bold text-slate-700">{trip.patientData.bloodGroup}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 font-bold ${trip.status === 'ARRIVED' ? 'text-emerald-600' : 'text-red-600'}`}>
                      <Clock size={14} />
                      <span>{trip.status === 'ARRIVED' ? 'Arrived' : `${Math.ceil(trip.currentEtaMinutes)} min`}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Paramedic: {trip.paramedicName}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${sc.bar}`}
                    style={{ width: `${trip.progress}%` }}
                  />
                </div>
              </div>

              {/* Live Vitals Monitor */}
              <div className="p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Monitor
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <VitalBox label="Heart Rate" value={trip.liveVitals.heartRate} unit="BPM" icon={<Heart size={12} />}
                    color={trip.liveVitals.heartRate > 120 || trip.liveVitals.heartRate < 50 ? 'text-red-400' : 'text-red-400'} />
                  <VitalBox label="SpO₂" value={trip.liveVitals.spo2} unit="%" icon={<Wind size={12} />}
                    color={trip.liveVitals.spo2 < 92 ? 'text-red-400' : 'text-blue-400'} />
                  <VitalBox label="Systolic" value={trip.liveVitals.bpSystolic} unit="mmHg" icon={<Gauge size={12} />}
                    color="text-amber-400" />
                  <VitalBox label="Diastolic" value={trip.liveVitals.bpDiastolic} unit="mmHg" icon={<Activity size={12} />}
                    color="text-amber-400" />
                </div>
              </div>

              {/* Expandable triage details */}
              <button
                onClick={() => setSelectedTrip(isExpanded ? null : trip.id)}
                className="w-full px-4 py-2.5 text-xs font-bold text-blue-600 border-t border-slate-100 hover:bg-blue-50 transition flex items-center justify-center gap-1"
              >
                {isExpanded ? 'Hide Details' : 'View Triage Details & Specialists'}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">AI Summary</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{trip.triageResult.summary}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specialists Needed</p>
                    <div className="flex flex-wrap gap-1.5">
                      {trip.triageResult.recommended_specialists.map(s => (
                        <span key={s} className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-lg font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Equipment Required</p>
                    <div className="flex flex-wrap gap-1.5">
                      {trip.triageResult.equipment_needed.map(e => (
                        <span key={e} className="text-xs bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-lg font-semibold">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HospitalView;
