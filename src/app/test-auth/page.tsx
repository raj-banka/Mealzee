"use client";
import React from "react";
import AuthFlipCard from "@/components/auth/AuthFlipCard";

export default function TestAuthPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-olive-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold mb-2">Auth Flip Demo</h1>
        <p className="text-gray-600 mb-6">Sign in or sign up by flipping the card. Uses WhatsApp OTP.</p>
        <AuthFlipCard onAuthenticated={() => alert("Authenticated!")} />
      </div>
    </div>
  );
}