'use client';

import { useState } from 'react';

interface OTPResponse {
  success: boolean;
  message?: string;
  error?: string;
  development_mode?: boolean;
  otp?: string;
  note?: string;
  sms_sent?: boolean;
}

interface VerifyResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export default function TestOTPPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const sendOTP = async () => {
    if (!phone) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data: OTPResponse = await response.json();

      if (data.success) {
        setOtpSent(true);
        setMessage(data.message || 'OTP sent successfully');
        
        // Show OTP in development mode
        if (data.development_mode && data.otp) {
          setDevOtp(data.otp);
          setMessage(`${data.message} (Dev OTP: ${data.otp})`);
        }
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Send OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setVerifyLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
      });

      const data: VerifyResponse = await response.json();

      if (data.success) {
        setMessage('✅ OTP verified successfully! Authentication complete.');
        setOtpSent(false);
        setOtp('');
        setDevOtp('');
      } else {
        setError(data.error || 'OTP verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Verify OTP error:', err);
    } finally {
      setVerifyLoading(false);
    }
  };

  const resetForm = () => {
    setPhone('');
    setOtp('');
    setOtpSent(false);
    setMessage('');
    setError('');
    setDevOtp('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Test OTP Authentication
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          New SMS Gateway Integration Test
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!otpSent ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Format: 9876543210 (without +91)
                </p>
              </div>

              <div>
                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center text-lg tracking-widest"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  OTP sent to {phone}
                </p>
                {devOtp && (
                  <p className="mt-1 text-xs text-blue-600 font-mono">
                    Dev Mode OTP: {devOtp}
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={verifyOTP}
                  disabled={verifyLoading}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Reset
                </button>
              </div>

              <div>
                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Test Information</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Uses new SMS Gateway API</p>
              <p>• Brute-force protection: Max 5 attempts per hour</p>
              <p>• Rate limiting: 30 seconds between requests</p>
              <p>• OTP expires in 5 minutes</p>
              <p>• Max 3 attempts per OTP</p>
              <p>• Development mode shows OTP in console/response</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
