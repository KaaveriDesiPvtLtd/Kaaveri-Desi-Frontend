// components/AdminNavbar.tsx
'use client';

// import "../../../Component/Admin/users/page"

import { useState } from 'react';
import {
    Menu,
    Bell,
    Search,
    User,
    LogOut,
    Settings
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

interface AdminNavbarProps {
    onMenuToggle?: () => void;
}

export default function AdminNavbar({ onMenuToggle }: AdminNavbarProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const router = useRouter();


    const gotoOrders = () => {
        router.push(`/Component/Admin/orders`);
    };


    const gotoUsers = () => {
        router.push(`/Component/Admin/users`);
    };





    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>

                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                </div>

                {/* Search Bar - Hidden on mobile */}
                {/* <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div> */}

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Search Icon for Mobile */}
                    <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Search className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Notifications */}
                    {/* <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                        >
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    <NotificationItem
                                        title="New Order Received"
                                        message="Order #12345 has been placed"
                                        time="5 min ago"
                                    />
                                    <NotificationItem
                                        title="Payment Confirmed"
                                        message="Payment for order #12344 confirmed"
                                        time="1 hour ago"
                                    />
                                    <NotificationItem
                                        title="New User Registration"
                                        message="A new user has registered"
                                        time="2 hours ago"
                                    />
                                </div>
                                <div className="px-4 py-2 border-t border-gray-200">
                                    <Link href="/admin/notifications" className="text-sm text-blue-600 hover:text-blue-800">
                                        View all notifications
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div> */}

                    {/* Profile Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <Link
                                    href="/admin/profile"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                                >
                                    <User className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">Profile</span>
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                                >
                                    <Settings className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm text-gray-700">Settings</span>
                                </Link>
                                <div className="border-t border-gray-200 my-2"></div>
                                <button
                                    onClick={() => {/* Handle logout */ }}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left"
                                >
                                    <LogOut className="w-4 h-4 text-red-600" />
                                    <span className="text-sm text-red-600">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>


                    <div>
                        <button
                            onClick={gotoOrders}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <span className="hidden md:block text-sm font-medium text-gray-700">Orders</span>
                        </button>
                    </div>



                     <div>
                        <button
                            onClick={gotoUsers}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <span className="hidden md:block text-sm font-medium text-gray-700">All Users</span>
                        </button>
                    </div>



                </div>
            </div>
        </nav>
    );
}

function NotificationItem({ title, message, time }: { title: string; message: string; time: string }) {
    return (
        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
            <h4 className="text-sm font-medium text-gray-800">{title}</h4>
            <p className="text-xs text-gray-600 mt-1">{message}</p>
            <span className="text-xs text-gray-400 mt-1">{time}</span>
        </div>
    );
}
