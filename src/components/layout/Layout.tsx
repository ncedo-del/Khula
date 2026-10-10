import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, ArrowLeftRight, Award, Briefcase, UserCircle } from 'lucide-react'

export const Layout: React.FC = () => {
  const { user } = useAuth()

  const desktopTabs = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Transactions & Cash Flow', icon: ArrowLeftRight },
    { to: '/passport', label: 'Business Passport', icon: Award },
    { to: '/opportunities', label: 'Opportunities & Funding', icon: Briefcase },
    { to: '/profile', label: 'Business Profile', icon: UserCircle },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 pb-16 md:pb-6">
      <Navbar />

      {/* Desktop Subnav Bar */}
      {user && (
        <div className="hidden md:block bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-6 overflow-x-auto py-2.5">
              {desktopTabs.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-sm font-medium py-1 px-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Bottom Nav for mobile */}
      {user && <BottomNav />}
    </div>
  )
}
