'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Plane,
  Building,
  FileText,
  BarChart,
  Settings,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Flights',
    icon: Plane,
    href: '/dashboard/flights',
    color: 'text-violet-500',
  },
  {
    label: 'Hotels',
    icon: Building,
    href: '/dashboard/hotels',
    color: 'text-pink-700',
  },
  {
    label: 'Visas',
    icon: FileText,
    href: '/dashboard/visas',
    color: 'text-orange-700',
  },
  {
    label: 'Reports',
    icon: BarChart,
    href: '/dashboard/reports',
    color: 'text-emerald-500',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'text-gray-500',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white transition-all duration-300',
        collapsed ? 'w-[80px]' : 'w-72'
      )}
    >
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center justify-between mb-14 px-3">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Trust Travel
              </h1>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-slate-800"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition',
                pathname === route.href
                  ? 'text-white bg-white/10'
                  : 'text-zinc-400',
                collapsed && 'justify-center'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn('h-5 w-5', route.color)} />
                {!collapsed && <span className="ml-3">{route.label}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
