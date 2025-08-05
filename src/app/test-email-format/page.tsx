'use client';

import React from 'react';

const TestEmailFormat = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-width-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Email Format Test - Long Dish Names</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">✅ CORRECT FORMAT (New Implementation)</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="font-semibold text-green-700 min-w-[130px] flex-shrink-0 mr-2">Dish:</span>
              <span className="flex-1 break-words leading-relaxed">
                Special Deluxe Chicken Biryani with Extra Raita and Pickle Combo Meal
              </span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold text-green-700 min-w-[130px] flex-shrink-0 mr-2">Quantity:</span>
              <span className="flex-1">3</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold text-green-700 min-w-[130px] flex-shrink-0 mr-2">Unit Price:</span>
              <span className="flex-1 font-semibold text-green-600">₹40</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold text-green-700 min-w-[130px] flex-shrink-0 mr-2">Address:</span>
              <span className="flex-1 break-words leading-relaxed">
                House No. 123, Lane 4, Sector 12, Near City Mall, Bokaro Steel City, Jharkhand - 827004
              </span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">❌ INCORRECT FORMAT (Old Implementation)</h2>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-red-700 mr-2">Dish:</span>
              <span>Special Deluxe Chicken Biryani with Extra Raita and Pickle Combo Meal</span>
            </div>
            <div>
              <span className="font-semibold text-red-700 mr-2">Address:</span>
              <span>House No. 123, Lane 4, Sector 12, Near City Mall, Bokaro Steel City, Jharkhand - 827004</span>
            </div>
          </div>
          <p className="text-red-600 text-sm mt-4">
            ⚠️ Problem: Long text continues on the same line, making it hard to read and misaligned.
          </p>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">📧 Email CSS Implementation</h2>
          <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`.data-row { 
  color: #555; 
  display: flex; 
  align-items: flex-start; 
}

.data-row strong { 
  color: #00430D; 
  font-weight: 600; 
  margin-right: 8px; 
  min-width: 130px; 
  flex-shrink: 0; 
}

.data-row .value { 
  flex: 1; 
  word-wrap: break-word; 
  line-height: 1.4; 
}`}
          </pre>
        </div>

        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-600">✨ Key Improvements</h2>
          <ul className="space-y-2 text-green-700">
            <li>• <strong>Flexbox Layout:</strong> Labels and values are properly aligned</li>
            <li>• <strong>Fixed Label Width:</strong> All labels have consistent 130px width</li>
            <li>• <strong>Word Wrapping:</strong> Long text wraps to new lines with proper indentation</li>
            <li>• <strong>Responsive Design:</strong> Works well on both desktop and mobile email clients</li>
            <li>• <strong>Professional Look:</strong> Clean, organized appearance for admin emails</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestEmailFormat;
