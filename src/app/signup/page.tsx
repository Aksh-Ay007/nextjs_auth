"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        userName: '',
        email: '',
        password: ''
    });

    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    // Email validation regex
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password validation (at least 6 characters)
    const isValidPassword = (password: string) => {
        return password.length >= 6;
    };

    const onSignup = async () => {
        // Client-side validation
        if (!user.userName.trim()) {
            toast.error("Please enter your name");
            return;
        }

        if (!isValidEmail(user.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (!isValidPassword(user.password)) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            setLoading(true);

            // Trim whitespace from inputs
            const userData = {
                userName: user.userName.trim(),
                email: user.email.trim().toLowerCase(),
                password: user.password
            };

            const response = await axios.post('/api/users/signup', userData);

            toast.success(response.data.message || "Account created successfully!");
            console.log("User created successfully:", response.data.user);
            
            router.push('/login');
            
        } catch (error:any) {
            // Show specific error message from server if available
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.message || 
                               "An error occurred while signing up. Please try again.";
            
            toast.error(errorMessage);
            console.error("Error during signup:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Enable button only when all fields are filled and valid
        const isFormValid = 
            user.userName.trim().length > 0 && 
            isValidEmail(user.email) && 
            isValidPassword(user.password);
        
        setButtonDisabled(!isFormValid);
    }, [user]);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50'>
            <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                        {loading ? "Processing..." : "Sign Up"}
                    </h1>
                    <hr className='border-gray-300 mb-6' />
                </div>

                <div className='space-y-4'>
                    <div>
                        <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>
                            Name
                        </label>
                        <input 
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200' 
                            id='name' 
                            type="text" 
                            value={user.userName} 
                            onChange={(e) => setUser({...user, userName: e.target.value})} 
                            placeholder='Enter your name'
                            disabled={loading}
                            required
                        />
                    </div>

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
                            disabled={loading}
                            required
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
                            placeholder='Enter your password (min. 6 characters)'
                            disabled={loading}
                            required
                        />
                        {user.password.length > 0 && user.password.length < 6 && (
                            <p className='text-sm text-red-600 mt-1'>
                                Password must be at least 6 characters
                            </p>
                        )}
                    </div>

                    <button 
                        onClick={onSignup} 
                        disabled={buttonDisabled || loading}
                        className={`w-full font-medium py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            buttonDisabled || loading 
                                ? 'bg-gray-400 cursor-not-allowed text-white' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                    <div className='text-center pt-4'>
                        <Link 
                            href='/login' 
                            className='text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-200'
                        >
                            Already have an account? Visit login page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}