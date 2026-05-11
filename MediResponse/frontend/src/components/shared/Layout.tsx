import React from 'react';
import { ViewMode, User, UserRole } from '../../types';
import { Ambulance, Building2, Activity, CreditCard, LogOut, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
  children: React.ReactNode;
  onLogout: () => void;
  user: User;
}

const roleConfig: Record<UserRole, { label: string; color: string; view: ViewMode }> = {
  PARAMEDIC:      { label: 'Ambulance Unit',  color: 'text-blue-600',    view: ViewMode.AMBULANCE },
  HOSPITAL_ADMIN: { label: 'Hospital Admin',   color: 'text-emerald-600', view: ViewMode.HOSPITAL },
  TOLL_OPERATOR:  { label: 'Toll Control',     color: 'text-amber-600',   view: ViewMode.TOLL },
};

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children, onLogout, user }) => {
  const config = roleConfig[user.role];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg">
                <Activity size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-none">MediResponse</h1>
                <p className={`text-xs font-bold uppercase tracking-wide ${config.color}`}>
                  {config.label}
                </p>
              </div>
            </div>

            {/* User info + logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <UserIcon size={14} className="text-slate-400" />
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">{user.employeeId}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
