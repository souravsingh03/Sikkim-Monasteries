import React, { useState } from 'react';
import { TollAlert, Severity } from '../../types';
import { ShieldCheck, Truck, CheckCircle2, Clock, AlertTriangle, BarChart3 } from 'lucide-react';

interface TollViewProps {
  alerts: TollAlert[];
  onClearAlert: (id: string) => void;
}

const severityColor: Record<Severity, string> = {
  CRITICAL: 'bg-red-100 text-red-700 border-red-200',
  MODERATE: 'bg-amber-100 text-amber-700 border-amber-200',
  STABLE:   'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const TollView: React.FC<TollViewProps> = ({ alerts, onClearAlert }) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'CLEARED'>('ALL');

  const active  = alerts.filter(a => !a.cleared);
  const cleared = alerts.filter(a => a.cleared);
  const shown   = filter === 'ALL' ? alerts : filter === 'ACTIVE' ? active : cleared;

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[55vh] text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <ShieldCheck size={36} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600">All Clear</h3>
        <p className="text-sm text-slate-400 mt-1">No active emergency clearance requests.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
          <div className="text-2xl font-bold text-slate-900">{alerts.length}</div>
          <div className="text-xs text-slate-500">Total Alerts</div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <div className="text-2xl font-bold text-red-600">{active.length}</div>
          <div className="text-xs text-slate-500">Active</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          <div className="text-2xl font-bold text-emerald-600">{cleared.length}</div>
          <div className="text-xs text-slate-500">Cleared</div>
        </div>
      </div>

      {/* Header + filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={22} className="text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">Toll Override System</h2>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(['ALL', 'ACTIVE', 'CLEARED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-bold px-3 py-1.5 rounded-md transition ${
                filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {shown.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">No alerts in this category.</div>
        )}
        {shown.map(alert => (
          <div
            key={alert.id}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
              alert.cleared ? 'opacity-60 border-slate-200' : 'border-red-200 ring-1 ring-red-100'
            }`}
          >
            <div className={`h-1 w-full ${alert.cleared ? 'bg-emerald-400' : 'bg-red-500 animate-pulse'}`} />
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full flex-shrink-0 ${alert.cleared ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  <Truck size={20} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{alert.tollName}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">{alert.ambulanceId}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${severityColor[alert.patientSeverity]}`}>
                          {alert.patientSeverity}
                        </span>
                        <span className="text-slate-500 text-xs">→ {alert.destination}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                      <Clock size={12} />
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="mt-3 bg-slate-50 rounded-lg p-3 text-sm">
                    Open lane: <span className="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">{alert.lane}</span>
                    <span className="text-slate-500 ml-2">for emergency passage</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {alert.cleared ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                        <CheckCircle2 size={14} /> Lane Cleared
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold animate-pulse">
                        <AlertTriangle size={14} /> Action Required
                      </div>
                    )}
                    {!alert.cleared && (
                      <button
                        onClick={() => onClearAlert(alert.id)}
                        className="text-xs font-bold bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition"
                      >
                        Mark Cleared
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TollView;
