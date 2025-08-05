'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, Settings } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const testEmailConfiguration = async () => {
    setIsTestingEmail(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'GET',
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to test email configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00430D] to-[#006B1A] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            🍽️ Mealzee Admin Dashboard
          </h1>
          <p className="text-green-100">
            Email Configuration & Order Management
          </p>
        </motion.div>

        {/* Email Configuration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-[#00430D] mr-2" />
            <h2 className="text-2xl font-bold text-[#00430D]">
              Email Configuration
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">SMTP Settings</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Host:</span> smtp.gmail.com</p>
                <p><span className="font-medium">Port:</span> 587</p>
                <p><span className="font-medium">Secure:</span> false</p>
                <p><span className="font-medium">From:</span> rajbanka80@gmail.com</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Admin Settings</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Admin Email:</span> mealzeeindia@gmail.com</p>
                <p><span className="font-medium">User Email:</span> rajbanka80@gmail.com</p>
                <p><span className="font-medium">Status:</span> 
                  <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Configured
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Test Email Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={testEmailConfiguration}
              disabled={isTestingEmail}
              className="flex items-center px-6 py-3 bg-[#00430D] text-white rounded-lg hover:bg-[#005A11] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestingEmail ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Testing Email...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Test Email
                </>
              )}
            </button>

            {/* Test Result */}
            {testResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-lg w-full max-w-md ${
                  testResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center mb-2">
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <span className={`font-medium ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult.success ? 'Success!' : 'Error!'}
                  </span>
                </div>
                <p className={`text-sm ${
                  testResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {testResult.message}
                </p>
                {testResult.details && (
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Order Flow Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-4">
            <Settings className="w-6 h-6 text-[#00430D] mr-2" />
            <h2 className="text-2xl font-bold text-[#00430D]">
              Order Flow Configuration
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">📧 Email Notifications (Primary)</h3>
              <p className="text-green-700 text-sm">
                Order details are automatically emailed to: <strong>mealzeeindia@gmail.com</strong>
              </p>
              <p className="text-green-600 text-xs mt-1">
                ✅ Silent background processing - users don't see email sending
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">👤 User Email Configuration</h3>
              <p className="text-yellow-700 text-sm">
                All users are assigned the email: <strong>rajbanka80@gmail.com</strong> (as requested)
              </p>
              <p className="text-yellow-600 text-xs mt-1">
                📝 No email collection required from users
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">🔄 Order Processing Flow</h3>
              <div className="text-blue-700 text-sm space-y-1">
                <p>1. User places order → Order confirmed instantly</p>
                <p>2. Email sent to admin automatically (background)</p>
                <p>3. Admin receives detailed order notification</p>
                <p>4. Admin contacts customer for confirmation</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-green-100 text-sm">
            To test the complete flow, place an order on the main website and check your email.
          </p>
          <a 
            href="/"
            className="inline-block mt-2 px-4 py-2 bg-white text-[#00430D] rounded-lg hover:bg-gray-100 transition-colors"
          >
            Go to Main Website
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
