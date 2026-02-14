// components/AdminSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Package,
    BarChart3,
    Settings,
    ChevronDown,
    X
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin/dashboard',
    },
    {
        title: 'Users',
        icon: Users,
        href: '/admin/users',
    },
    {
        title: 'Orders',
        icon: ShoppingCart,
        href: '/admin/orders',
    },
    {
        title: 'Products',
        icon: Package,
        href: '/admin/products',
        subItems: [
            { title: 'All Products', href: '/admin/products' },
            { title: 'Add Product', href: '/admin/products/add' },
            { title: 'Categories', href: '/admin/products/categories' },
        ]
    },
    {
        title: 'Analytics',
        icon: BarChart3,
        href: '/admin/analytics',
    },
    {
        title: 'Settings',
        icon: Settings,
        href: '/admin/settings',
    },
];

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const toggleExpand = (title: string) => {
        setExpandedItem(expandedItem === title ? null : title);
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <h2 className="text-xl font-bold">Admin Panel</h2>
                        <button
                            onClick={onClose}
                            className="lg:hidden p-1 hover:bg-gray-800 rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1 px-3">
                            {menuItems.map((item) => (
                                <li key={item.title}>
                                    {item.subItems ? (
                                        <div>
                                            <button
                                                onClick={() => toggleExpand(item.title)}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-5 h-5" />
                                                    <span>{item.title}</span>
                                                </div>
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform ${
                                                        expandedItem === item.title ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </button>
                                            {expandedItem === item.title && (
                                                <ul className="mt-1 ml-8 space-y-1">
                                                    {item.subItems.map((subItem) => (
                                                        <li key={subItem.href}>
                                                            <Link
                                                                href={subItem.href}
                                                                className={`block px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors ${
                                                                    pathname === subItem.href
                                                                        ? 'bg-blue-600'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {subItem.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors ${
                                                pathname === item.href ? 'bg-blue-600' : ''
                                            }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="text-xs text-gray-400">
                            © 2025 Admin Dashboard
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
