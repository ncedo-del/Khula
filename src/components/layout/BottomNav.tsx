import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Award, Briefcase, UserCircle } from 'lucide-react'

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Cash Flow', icon: ArrowLeftRight },
    { to: '/passport', label: 'Passport', icon: Award },
    { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
    { to: '/profile', label: 'Profile', icon: UserCircle },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex justify-around items-center backdrop-blur-lg">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[11px] font-medium transition-colors ${
              isActive
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Icon className="w-5 h-5 mb-0.5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
