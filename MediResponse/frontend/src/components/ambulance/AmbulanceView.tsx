import React, { useState, useEffect } from 'react';
import { Hospital, PatientData, TriageResult, Severity, User } from '../../types';
import { triagePatient } from '../../services/geminiService';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import {
  MapPin, Siren, CheckCircle, AlertTriangle, Activity,
  Stethoscope, Mic, MicOff, Star, Navigation, RotateCcw,
  User as UserIcon, Droplets, ChevronRight, WifiOff,
} from 'lucide-react';

interface AmbulanceViewProps {
  onStartTrip: (hospitalId: string, patientData: PatientData, triage: TriageResult) => void;
  hospitals: Hospital[];
  user: User;
}

const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−', 'Unknown'];

const severityStyle: Record<Severity, { bg: string; border: string; text: string; badge: string }> = {
  CRITICAL: { bg: 'bg-red-50',     border: 'border-red-200',   text: 'text-red-700',     badge: 'bg-red-600 text-white'     },
  MODERATE: { bg: 'bg-amber-50',   border: 'border-amber-200', text: 'text-amber-700',   badge: 'bg-amber-500 text-white'   },
  STABLE:   { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-600 text-white' },
};

const AmbulanceView: React.FC<AmbulanceViewProps> = ({ onStartTrip, hospitals, user }) => {
  const [step, setStep] = useState<'form' | 'triage' | 'confirm' | 'dispatched'>('form');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [patientData, setPatientData] = useState<PatientData>({
    name: '', age: 0, gender: 'Male', bloodGroup: 'Unknown', symptoms: '', vitals: '',
  });

  const [triageResult, setTriageResult]     = useState<TriageResult | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [sortedHospitals, setSortedHospitals]   = useState<Hospital[]>(hospitals);

  // ── Voice input (fixed) ───────────────────────────────────────────────────
  const {
    isListening,
    isSupported: voiceSupported,
    errorMessage: voiceError,
    toggleListening,
    status: voiceStatus,
  } = useSpeechRecognition({
    lang: 'en-US',
    onResult: (transcript) => {
      setPatientData(prev => ({
        ...prev,
        symptoms: prev.symptoms ? `${prev.symptoms} ${transcript}` : transcript,
      }));
    },
  });

  // ── Hospital sorting ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!triageResult) { setSortedHospitals(hospitals); return; }
    const sorted = [...hospitals].sort((a, b) => {
      const aMatch = triageResult.recommended_specialists.some(s =>
        a.specialties.some(h => h.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(h.toLowerCase()))
      );
      const bMatch = triageResult.recommended_specialists.some(s =>
        b.specialties.some(h => h.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(h.toLowerCase()))
      );
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return a.etaMinutes - b.etaMinutes;
    });
    setSortedHospitals(sorted);
    setSelectedHospital(sorted[0]?.id ?? null);
  }, [triageResult, hospitals]);

  const handleAnalyze = async () => {
    if (!patientData.symptoms.trim() || !patientData.vitals.trim()) return;
    setIsAnalyzing(true);
    const result = await triagePatient(patientData);
    setTriageResult(result);
    setIsAnalyzing(false);
    setStep('triage');
  };

  const handleDispatch = () => {
    if (selectedHospital && triageResult) {
      onStartTrip(selectedHospital, patientData, triageResult);
      setStep('dispatched');
    }
  };

  const reset = () => {
    setStep('form');
    setPatientData({ name: '', age: 0, gender: 'Male', bloodGroup: 'Unknown', symptoms: '', vitals: '' });
    setTriageResult(null);
    setSelectedHospital(null);
    setSortedHospitals(hospitals);
  };

  // ── Dispatched screen ─────────────────────────────────────────────────────
  if (step === 'dispatched') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Navigation size={44} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Ambulance Dispatched</h2>
        <p className="text-slate-500 mb-2 max-w-xs">
          Hospital notified. Tolls alerted. Live vitals transmitting.
        </p>
        <p className="text-sm font-bold text-blue-600 mb-8">
          Patient: {patientData.name || 'Unknown'} · {patientData.bloodGroup}
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition active:scale-[0.98]"
        >
          <RotateCcw size={18} /> New Case
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6">

      {/* LEFT: Patient form + triage result */}
      <div className="lg:col-span-7 space-y-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border-b border-slate-100">
            <Stethoscope size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-800">Patient Assessment</h2>
            {step !== 'form' && (
              <button
                onClick={() => setStep('form')}
                className="ml-auto text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
              >
                <RotateCcw size={12} /> Edit
              </button>
            )}
          </div>

          <div className="p-5 space-y-4">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Patient Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                  placeholder="Full name (if known)"
                  value={patientData.name}
                  onChange={e => setPatientData({ ...patientData, name: e.target.value })}
                  disabled={step !== 'form'}
                />
                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Age / Gender / Blood Group */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Age</label>
                <input
                  type="number" min={0} max={120}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                  placeholder="—"
                  value={patientData.age || ''}
                  onChange={e => setPatientData({ ...patientData, age: parseInt(e.target.value) || 0 })}
                  disabled={step !== 'form'}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition"
                  value={patientData.gender}
                  onChange={e => setPatientData({ ...patientData, gender: e.target.value as any })}
                  disabled={step !== 'form'}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  <span className="flex items-center gap-1"><Droplets size={10} /> Blood</span>
                </label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition"
                  value={patientData.bloodGroup}
                  onChange={e => setPatientData({ ...patientData, bloodGroup: e.target.value })}
                  disabled={step !== 'form'}
                >
                  {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {/* Vitals */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Initial Vitals
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                placeholder="BP 120/80, HR 92, SpO2 98%..."
                value={patientData.vitals}
                onChange={e => setPatientData({ ...patientData, vitals: e.target.value })}
                disabled={step !== 'form'}
              />
            </div>

            {/* Symptoms + Voice Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Symptoms &amp; Notes
                </label>

                {step === 'form' && (
                  voiceSupported ? (
                    <button
                      onClick={toggleListening}
                      title={isListening ? 'Stop listening' : 'Start voice input'}
                      className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-3 py-1.5 rounded-full transition-all select-none ${
                        isListening
                          ? 'bg-red-100 text-red-600 ring-2 ring-red-400 ring-offset-1 animate-pulse'
                          : voiceStatus === 'error'
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                      {isListening ? 'Stop' : voiceStatus === 'error' ? 'Retry Voice' : 'Voice Input'}
                    </button>
                  ) : (
                    <span
                      title="Speech recognition not supported in this browser"
                      className="flex items-center gap-1 text-[10px] text-slate-400 px-2 py-1 bg-slate-50 rounded-full border border-slate-200"
                    >
                      <WifiOff size={10} /> No voice
                    </span>
                  )
                )}
              </div>

              {/* Voice error / status banner */}
              {voiceError && step === 'form' && (
                <div className="mb-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                  {voiceError}
                </div>
              )}

              {isListening && (
                <div className="mb-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700">
                  <span className="flex gap-0.5">
                    {[0, 150, 300].map(d => (
                      <span
                        key={d}
                        className="w-1 h-3 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </span>
                  Listening… speak now
                </div>
              )}

              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none h-28 resize-none transition"
                placeholder="Describe patient condition, trauma type, consciousness level… or use Voice Input above."
                value={patientData.symptoms}
                onChange={e => setPatientData({ ...patientData, symptoms: e.target.value })}
                disabled={step !== 'form'}
              />
            </div>

            {step === 'form' && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !patientData.symptoms.trim() || !patientData.vitals.trim()}
                className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    AI Analyzing Patient…
                  </>
                ) : (
                  <><Activity size={20} /> Run AI Triage</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Triage Result */}
        {triageResult && (
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${severityStyle[triageResult.severity].bg} ${severityStyle[triageResult.severity].border}`}>
            <div className="px-5 py-4 flex items-center gap-3 border-b border-inherit">
              {triageResult.severity === Severity.CRITICAL
                ? <AlertTriangle size={20} className="text-red-600" />
                : <CheckCircle  size={20} className="text-emerald-600" />
              }
              <h3 className={`font-bold text-base ${severityStyle[triageResult.severity].text}`}>
                AI Triage — {triageResult.severity}
              </h3>
              <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${severityStyle[triageResult.severity].badge}`}>
                {triageResult.severity}
              </span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-700 text-sm leading-relaxed">{triageResult.summary}</p>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Specialists Needed</p>
                <div className="flex flex-wrap gap-2">
                  {triageResult.recommended_specialists.map(s => (
                    <span key={s} className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-lg font-semibold shadow-sm">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Equipment to Prepare</p>
                <div className="flex flex-wrap gap-2">
                  {triageResult.equipment_needed.map(e => (
                    <span key={e} className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-lg font-semibold shadow-sm">{e}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Hospital Selection */}
      <div className="lg:col-span-5">
        <div
          className="bg-white rounded-2xl shadow-sm border border-slate-200 sticky top-20 overflow-hidden flex flex-col"
          style={{ maxHeight: 'calc(100vh - 6rem)' }}
        >
          <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border-b border-slate-100">
            <MapPin size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-800">Select Hospital</h2>
            {triageResult && (
              <span className="ml-auto text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                AI Sorted
              </span>
            )}
          </div>

          <div className="overflow-y-auto flex-grow p-3 space-y-3 min-h-[280px]">
            {!triageResult && (
              <div className="text-center py-10 text-slate-400 text-sm">
                <MapPin size={28} className="mx-auto mb-2 opacity-30" />
                Run AI triage first to get smart hospital recommendations.
              </div>
            )}
            {sortedHospitals.map((hospital, index) => {
              const isBest    = triageResult && index === 0;
              const isSelected = selectedHospital === hospital.id;
              return (
                <button
                  key={hospital.id}
                  onClick={() => setSelectedHospital(hospital.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all relative overflow-hidden ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {isBest && (
                    <span className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
                      <Star size={9} fill="currentColor" /> Best Match
                    </span>
                  )}
                  <div className="flex justify-between items-start mb-1 pr-16">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{hospital.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{hospital.address}</p>
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mb-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{hospital.etaMinutes} min</span>
                    <span>{hospital.distanceKm} km</span>
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${hospital.occupied > 85 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      {hospital.occupied}% capacity
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hospital.specialties.slice(0, 3).map(s => (
                      <span key={s} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">{s}</span>
                    ))}
                    {hospital.specialties.length > 3 && (
                      <span className="text-[10px] text-slate-400">+{hospital.specialties.length - 3} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <button
              onClick={handleDispatch}
              disabled={!selectedHospital || !triageResult}
              className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25"
            >
              <Siren size={20} className={selectedHospital && triageResult ? 'animate-pulse' : ''} />
              Dispatch Ambulance
              {selectedHospital && triageResult && <ChevronRight size={18} />}
            </button>
            {(!selectedHospital || !triageResult) && (
              <p className="text-center text-xs text-slate-400 mt-2">
                Complete triage and select a hospital first
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbulanceView;
