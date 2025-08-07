
"use client";
import React, { useState } from 'react';

const TrackLocationPage = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLocation({ lat, lon });
        sendLocation(lat, lon);
      },
      (err) => {
        setError(err.message || 'Unable to retrieve location.');
        setLoading(false);
      }
    );
  };

  const sendLocation = async (lat: number, lon: number) => {
    try {
      const res = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || 'Location sent successfully!');
      } else {
        setError(data.error || 'Failed to send location.');
      }
    } catch (e: any) {
      setError(e.message || 'Network error.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-olive-50 px-4">
      <h1 className="text-3xl font-bold mb-6">Track Your Location</h1>
      <button
        className="px-6 py-3 bg-olive-600 text-white rounded-lg font-semibold shadow hover:bg-olive-700 transition mb-4"
        onClick={handleGetLocation}
        disabled={loading}
      >
        {loading ? 'Locating...' : 'Get My Location'}
      </button>
      {location && (
        <div className="mb-4 text-lg text-gray-800">
          <div>Latitude: <span className="font-mono">{location.lat}</span></div>
          <div>Longitude: <span className="font-mono">{location.lon}</span></div>
        </div>
      )}
      {success && <div className="text-green-600 font-medium mb-2">{success}</div>}
      {error && <div className="text-red-600 font-medium mb-2">{error}</div>}
      <p className="text-gray-500 mt-8 text-sm">Your location is only collected with your consent and sent securely.</p>
    </div>
  );
};

export default TrackLocationPage;
