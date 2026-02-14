// components/UserDetailsModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { X, Package, Eye, Trash2, Edit } from 'lucide-react';
import apiClient from '@/lib/api';

interface Order {
    orderId: string;
    orderDate: string;
    totalAmount: number;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    orderItems: Array<{
        productId: string;
        image: string;
        title: string;
        price: string;
        quantity: number;
    }>;
    shippingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    trackingId?: string;
}

interface User {
    _id: string;
    name: string;
    userName: string;
    email: string;
    createdAt: string;
    placedOrders: Order[];
}

interface UserDetailsModalProps {
    userId: string;
    onClose: () => void;
}

export default function UserDetailsModal({ userId, onClose }: UserDetailsModalProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            const response = await apiClient.get(`/users/${userId}`);
            const data = response.data;
            setUser(data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string, trackingId?: string) => {
        try {
            await apiClient.patch(`/orders/${userId}/${orderId}`, { 
                orderStatus: newStatus,
                ...(trackingId && { trackingId })
            });
            fetchUserDetails(); // Refresh data
            setShowOrderDetails(false);
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
                <div className="min-h-screen px-4 py-8 flex items-center justify-center">
                    <div className="bg-white rounded-lg w-full max-w-6xl shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage user information and orders</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* User Info Section */}
                        <div className="p-6 bg-gray-50 border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Username</p>
                                    <p className="font-semibold text-gray-800">{user.userName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-800">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Member Since</p>
                                    <p className="font-semibold text-gray-800">
                                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Orders</p>
                                    <p className="font-semibold text-gray-800">{user.placedOrders?.length || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Spent</p>
                                    <p className="font-semibold text-gray-800">
                                        ₹{user.placedOrders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Orders Section */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Orders History
                            </h3>

                            {user.placedOrders && user.placedOrders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {user.placedOrders.map((order) => (
                                                <tr key={order.orderId} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                        {order.orderId}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {new Date(order.orderDate).toLocaleDateString('en-IN')}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {order.orderItems.length}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                                        ₹{order.totalAmount}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        <div>{order.paymentMethod.toUpperCase()}</div>
                                                        <div className="text-xs text-gray-500">{order.paymentStatus}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setShowOrderDetails(true);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800 p-1"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p>No orders found</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    userId={userId}
                    onClose={() => setShowOrderDetails(false)}
                    onUpdate={updateOrderStatus}
                />
            )}
        </>
    );
}

function OrderDetailsModal({ order, userId, onClose, onUpdate }: any) {
    const [newStatus, setNewStatus] = useState(order.orderStatus);
    const [trackingId, setTrackingId] = useState(order.trackingId || '');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] overflow-y-auto">
            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
                <div className="bg-white rounded-lg w-full max-w-4xl shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800">Order Details - {order.orderId}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        {/* Order Items */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                            <div className="space-y-3">
                                {order.orderItems.map((item: any, index: number) => (
                                    <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{item.title}</p>
                                            <p className="text-sm text-gray-500">Product ID: {item.productId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-800">₹{item.price}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-3">Shipping Address</h4>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                                <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                                <p className="text-sm text-gray-600 mt-2">
                                    {order.shippingAddress.addressLine1}
                                    {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                </p>
                                <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                            </div>
                        </div>

                        {/* Order Management */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tracking ID</label>
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    placeholder="Enter tracking ID"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800">Total Amount:</span>
                                <span className="text-2xl font-bold text-blue-600">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={() => onUpdate(order.orderId, newStatus, trackingId)}
                            className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Update Order
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
