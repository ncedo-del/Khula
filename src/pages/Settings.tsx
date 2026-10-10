import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Sliders, Bell, Smartphone, ShieldCheck } from 'lucide-react'

export const Settings: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Sliders className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">App Settings</h1>
            <p className="text-xs text-slate-500">
              Manage your PWA preferences and offline indicators.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-slate-700" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">PWA Standalone Mode</span>
                <span className="text-[11px] text-slate-500">
                  Business Passport installs directly to your home screen
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Enabled
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-700" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">Financial Integrity Policy</span>
                <span className="text-[11px] text-slate-500">
                  Transactions require live network sync to prevent offline corruption
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              Active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-700" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">Opportunity Alerts</span>
                <span className="text-[11px] text-slate-500">
                  Receive notifications when matching township grants open
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              On
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-400">
          Account signed in as: <strong className="text-slate-700">{user?.email}</strong>
        </div>
      </div>
    </div>
  )
}
