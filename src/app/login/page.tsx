
"use client"
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { axios } from 'axios';

export default function LoginPage() {
    const [user, setUser] = React.useState({
        email: '',
        password: ''
    })

    const onLogin = async () => {}

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50'>
            <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Login</h1>
                    <hr className='border-gray-300 mb-6' />
                </div>

                <div className='space-y-4'>
                  
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>
                            Email
                        </label>
                        <input 
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200' 
                            id='email'  
                            type="email" 
                            value={user.email} 
                            onChange={(e) => setUser({...user, email: e.target.value})} 
                            placeholder='Enter your email' 
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1'>
                            Password
                        </label>
                        <input 
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200' 
                            id='password' 
                            type="password" 
                            value={user.password} 
                            onChange={(e) => setUser({...user, password: e.target.value})} 
                            placeholder='Enter your password' 
                        />
                    </div>

                    <button 
                        onClick={onLogin} 
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    >
                       Login
                    </button>

                    <div className='text-center pt-4'>
                        <Link 
                            href='/signup' 
                            className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-200'
                        >
                            Dont have an account? Visit SignUp page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}