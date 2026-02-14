// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import Navbar from "../navbar/page"
import apiClient from '@/lib/api';


interface DashboardStats {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await apiClient.get(`/stats`);
            const data = response.data;
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div>
            <Navbar/>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        icon={<Users className="w-8 h-8" />}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats?.totalOrders || 0}
                        icon={<ShoppingCart className="w-8 h-8" />}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`₹${stats?.totalRevenue || 0}`}
                        icon={<DollarSign className="w-8 h-8" />}
                        color="bg-yellow-500"
                    />
                    <StatCard
                        title="Pending Orders"
                        value={stats?.pendingOrders || 0}
                        icon={<Package className="w-8 h-8" />}
                        color="bg-red-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                        <div className="space-y-3">
                            <StatusItem label="Pending" count={stats?.pendingOrders || 0} color="text-yellow-600" />
                            <StatusItem label="Processing" count={stats?.processingOrders || 0} color="text-blue-600" />
                            <StatusItem label="Shipped" count={stats?.shippedOrders || 0} color="text-purple-600" />
                            <StatusItem label="Delivered" count={stats?.deliveredOrders || 0} color="text-green-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-2xl font-bold mt-2">{value}</p>
                </div>
                <div className={`${color} text-white p-3 rounded-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

function StatusItem({ label, count, color }: any) {
    return (
        <div className="flex justify-between items-center">
            <span className={`${color} font-medium`}>{label}</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">{count}</span>
        </div>
    );
}
