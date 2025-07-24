
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  MonitorSmartphone,
  MessageSquare,
  MessageCircleReply,
  Contact
} from 'lucide-react';
import { Link } from '@inertiajs/inertia-react';
import { Button } from '../common/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../common/dropdown-menu';

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Contacts', href: '/contacs', icon: Contact },
    { name: 'Messages', href: '/messages/', icon: MessageSquare },
    { name: 'Spoof SMS', href: '/spoof-sms/', icon: MessageCircleReply },
    { name: 'Devices', href: '/targets/', icon: MonitorSmartphone },
  ];

  const handleLogout = () => {};

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-5 border-b">
          <div className="flex items-center space-x-3">
            <img src={`${import.meta.env.VITE_APP_URL}/static/logo_blue.png`} className="h-8 w-8" alt="" />
            {sidebarOpen && (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Adospy
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full justify-start"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            {sidebarOpen && <span className="ml-2">Collapse</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-l px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                id="role"
                name="role"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="founder">Founder/CEO</option>
                <option value="manager">Manager</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="support">Customer Support</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href='/profile/' className='flex'>
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
