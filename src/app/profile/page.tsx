'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface UserData {
    _id: string;
    userName: string; // Changed from 'name' to 'userName'
    email: string;
    createdAt?: string;
    isVarified?: boolean; // Keep the typo to match your schema
}

export default function ProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const getUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users/me');
            console.log("User data:", response.data.data);
            setUserData(response.data.data);
            setError('');
        } catch (error: any) {
            console.error("Error fetching user data:", error);
            setError("Failed to load user data");
            // If unauthorized, redirect to login
            if (error.response?.status === 401) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.get('/api/users/logout');
            console.log("Logout successful");
            router.push('/login');
        } catch (error) {
            console.error("Logout error:", error);
            // Even if logout API fails, redirect to login
            router.push('/login');
        }
    };

    // Fetch user data when component mounts
    useEffect(() => {
        getUserData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Profile Page</h1>
                    <div className="flex gap-4">
                        <button 
                            onClick={getUserData}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
                        >
                            Refresh Data
                        </button>
                        <button 
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <div className="flex items-center justify-between">
                            <span>{error}</span>
                            <button 
                                onClick={getUserData}
                                className="text-red-600 hover:text-red-800 font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {userData ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* User Info Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 ml-3">User Information</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Full Name
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                                        {userData.userName}
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Email Address
                                    </label>
                                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                                        {userData.email}
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Account Status
                                    </label>
                                    <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                            userData.isVarified ? 'bg-green-500' : 'bg-yellow-500'
                                        }`}></span>
                                        <span className="font-semibold text-gray-900">
                                            {userData.isVarified ? 'Verified' : 'Unverified'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Details Card */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 ml-3">Account Details</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        User ID
                                    </label>
                                    <p className="text-sm font-mono text-gray-700 bg-gray-50 p-3 rounded-lg break-all">
                                        {userData._id}
                                    </p>
                                </div>
                                
                                {userData.createdAt && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Member Since
                                        </label>
                                        <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                                            {new Date(userData.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Last Updated
                                    </label>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        {new Date().toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="flex flex-wrap gap-4">
                                <Link 
                                    href={`/profile/${userData._id}`}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition duration-200 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Detailed Profile
                                </Link>
                                
                                <Link 
                                    href="/"
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Go to Home
                                </Link>
                                
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(userData._id);
                                        alert('User ID copied to clipboard!');
                                    }}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition duration-200 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy User ID
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="text-gray-500 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No User Data</h3>
                        <p className="text-gray-600 mb-4">Unable to load user profile data.</p>
                        <button 
                            onClick={getUserData}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                        >
                            Try Loading Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}