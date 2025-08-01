'use client';

import React, { useState } from 'react';

const TestContactPage: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testContactForm = async () => {
    setLoading(true);
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+91 9876543210',
      subject: 'Test Message',
      message: 'This is a test message to verify WhatsApp integration is working correctly.',
      referenceId: Date.now().toString().slice(-6)
    };

    try {
      const response = await fetch('/api/auto-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          data: testData
        })
      });

      const result = await response.json();
      setResult(result);
      
      if (result.whatsappUrl) {
        console.log('Opening WhatsApp URL:', result.whatsappUrl);
        window.open(result.whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Test failed:', error);
      setResult({ error: error.message });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">WhatsApp Contact Form Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={testContactForm}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test WhatsApp Integration'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Test Result:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestContactPage;
