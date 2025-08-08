'use client';

import React, { useState, useEffect } from 'react';
import { 
  sendSMSOTP, 
  verifySMSOTP, 
  cleanupAuth,
  getCurrentUser,
  signOutUser
} from '@/lib/auth';

export default function TestSMSOTP() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current user
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setMessage('✅ SMS authentication ready');

    // Cleanup on unmount
    return () => {
      cleanupAuth();
    };
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const success = await sendSMSOTP(phoneNumber);
      if (success) {
        setMessage('✅ OTP sent successfully to ' + phoneNumber);
        setStep('otp');
      } else {
        setMessage('❌ Failed to send OTP');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error);
    }

    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const success = await verifySMSOTP(otp, phoneNumber);
      if (success) {
        setMessage('✅ OTP verified successfully!');
        setStep('success');
        setUser(getCurrentUser());
      } else {
        setMessage('❌ Invalid OTP code');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error);
    }

    setIsLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setMessage('✅ Signed out successfully');
      setStep('phone');
      setUser(null);
      setPhoneNumber('');
      setOtp('');
    } catch (error) {
      setMessage('❌ Sign out error: ' + error);
    }
  };

  const resetTest = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
    setMessage('');
    cleanupAuth();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Fast2SMS OTP Test</h1>
        
        {/* Current User Status */}
        {user && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              <strong>Logged in as:</strong> {user.phone}
            </p>
            <button
              onClick={handleSignOut}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Phone Number Step */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (10 digits)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter 10-digit Indian mobile number (without +91)
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit OTP sent to {phoneNumber}
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={resetTest}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Back to Phone Number
            </button>
          </form>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-6xl">✅</div>
            <h2 className="text-xl font-semibold text-gray-800">
              Authentication Successful!
            </h2>
            <p className="text-gray-600">
              You have successfully logged in with Fast2SMS OTP.
            </p>
            <button
              onClick={resetTest}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Test Again
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Instructions:</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Enter your 10-digit Indian mobile number</li>
            <li>• You will receive an SMS with a 6-digit OTP via Fast2SMS</li>
            <li>• Enter the OTP to complete authentication</li>
            <li>• Make sure Fast2SMS API key is configured in .env.local</li>
            <li>• Ensure you have sufficient balance in your Fast2SMS account</li>
          </ul>
        </div>

        {/* API Status */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Fast2SMS Status:</strong> Using recharged account for real SMS delivery
          </p>
        </div>
      </div>
    </div>
  );
}