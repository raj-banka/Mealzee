"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, Phone, User, Mail, Calendar, Gift } from "lucide-react";
import { sendSMSOTP, verifySMSOTP } from "@/lib/auth";

interface Props {
  onAuthenticated?: (user: { phone: string; name?: string; dob?: string; refCode?: string }) => void;
  embedded?: boolean;
}

export default function AuthFlipCard({ onAuthenticated, embedded }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string>("");

  // shared state
  const [phone, setPhone] = useState("");

  // signup-only fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [refCode, setRefCode] = useState("");

  // OTP state
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);

  const isPhoneValid = useMemo(() => /^\d{10}$/.test(phone), [phone]);
  const otpValue = useMemo(() => otp.join(""), [otp]);

  const handleSendOtp = async () => {
    setError("");
    if (!isPhoneValid) {
      setError("Enter 10-digit phone number");
      return;
    }
    setIsSending(true);
    const res = await sendSMSOTP(phone);
    setIsSending(false);
    if (!res?.success) {
      setError(res?.error || "Failed to send OTP");
      return;
    }
    setShowOtp(true);
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otpValue.length !== 4) {
      setError("Enter 4-digit OTP");
      return;
    }
    setIsVerifying(true);
    const ok = await verifySMSOTP(otpValue, phone);
    setIsVerifying(false);
    if (!ok) {
      setError("Invalid OTP");
      setOtp(["", "", "", ""]);
      return;
    }
    if (isFlipped) {
      try {
        await fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: `+91${phone}`.replace(/\D/g, ""),
            name: name || undefined,
            email: email || undefined,
            dob: dob || undefined,
          }),
        });
      } catch {}
    }
    onAuthenticated?.({ phone, name, dob, refCode });
  };

  /** Reusable Card face */
  const Card = ({
    children,
    className = "",
    style = {},
  }: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "translateZ(0)",
        ...style,
      }}
      aria-hidden={false}
    >
      <div
        className={
          embedded
            ? "relative h-full w-full rounded-xl bg-white shadow-md overflow-hidden"
            : "relative h-full w-full rounded-2xl p-[2px] overflow-hidden shadow-2xl"
        }
      >
        {!embedded && (
          <>
            {/* Animated gradient border */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-2xl"
              style={{
                background:
                  "conic-gradient(from 0deg, var(--primary-emerald), var(--primary-teal), var(--accent-mint), var(--primary-emerald))",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            />
            {/* Soft glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-2xl opacity-30 bg-gradient-to-tr from-emerald-300 via-teal-300 to-emerald-400" />
          </>
        )}

        {/* Actual surface with INTERNAL SCROLL only */}
        <div
          className={
            embedded
              ? "h-full w-full rounded-xl bg-white p-4 sm:p-6 overflow-y-auto"
              : "h-full w-full rounded-[calc(1rem-2px)] bg-white/95 backdrop-blur p-4 sm:p-6 overflow-y-auto"
          }
        >
          {/* Decorative background tint */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -inset-20 rounded-[inherit] bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(20,184,166,0.08),transparent_35%)]" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className={embedded ? "w-full" : "w-full flex items-center justify-center py-6 sm:py-10"}>
      {/* SCENE: holds perspective (page never flips) */}
      <div
        className={embedded ? "relative w-full" : "relative w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl"}
        style={{ perspective: 1100, WebkitPerspective: 1100 }}
      >
        {/* FLIPPER: only this element rotates */}
        <motion.div
          className="relative w-full h-[600px] sm:h-[560px] lg:h-[650px] xl:h-[700px] 2xl:h-[750px]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.68, -0.55, 0.27, 1.55] }}
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {/* FRONT: Sign In */}
          <Card style={{ pointerEvents: isFlipped ? "none" : "auto" }}>
            <div className="relative">
              <h2 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold mb-1 lg:mb-2 xl:mb-3 2xl:mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                👋 Welcome back
              </h2>
              <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600 mb-5 lg:mb-6 xl:mb-7 2xl:mb-8">Sign in with your phone via SMS OTP</p>

              <label className="block text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium text-gray-700 mb-2 lg:mb-3 xl:mb-4">Phone</label>
              <div className="flex gap-2 lg:gap-3 xl:gap-4 mb-4 lg:mb-5 xl:mb-6 2xl:mb-7">
                <span className="inline-flex items-center px-3 lg:px-4 xl:px-5 2xl:px-6 rounded-md bg-gray-100 text-gray-600 text-sm lg:text-base xl:text-lg 2xl:text-xl border border-gray-200 shadow-sm">
                  +91
                </span>
                <div className="relative flex-1">
                  <Phone size={16} className="absolute left-3 lg:left-4 xl:left-5 2xl:left-6 top-1/2 -translate-y-1/2 text-gray-400 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10 digit number"
                    inputMode="numeric"
                    className="flex-1 w-full rounded-md border border-gray-300 pl-9 lg:pl-12 xl:pl-14 2xl:pl-16 pr-3 lg:pr-4 xl:pr-5 2xl:pr-6 py-2 lg:py-3 xl:py-4 2xl:py-5 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl focus:outline-none focus:ring-4 focus:ring-emerald-400/50 transition-all shadow-sm"
                  />
                </div>
              </div>

              {!showOtp ? (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  onClick={handleSendOtp}
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 shadow-lg shadow-emerald-600/20"
                >
                  {isSending ? "Sending..." : (
                    <>
                      Send OTP <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 mt-3">Enter OTP</label>
                  <div className="flex gap-2 sm:gap-3 mb-4 justify-center">
                    {otp.map((d, i) => (
                      <motion.input
                        key={i}
                        value={d}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 1);
                          const next = [...otp];
                          next[i] = v;
                          setOtp(next);
                        }}
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        inputMode="numeric"
                        placeholder="•"
                        className="w-12 h-12 sm:w-12 sm:h-12 text-center text-lg font-semibold rounded-md border border-gray-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/60 transition-all shadow-sm"
                      />
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98, y: 0 }}
                      onClick={handleVerifyOtp}
                      disabled={isVerifying}
                      className="flex-1 rounded-lg py-2.5 text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 shadow-lg shadow-emerald-600/20"
                    >
                      {isVerifying ? "Verifying..." : "Verify & Continue"}
                    </motion.button>
                    <button
                      onClick={() => {
                        setShowOtp(false);
                        setOtp(["", "", "", ""]);
                        setError("");
                      }}
                      className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2 text-sm shadow-sm"
                    >
                      <RotateCcw size={16} /> Reset
                    </button>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-600 mt-3"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-6 text-sm text-gray-600">
                New here?{" "}
                <button
                  className="text-emerald-700 font-medium hover:underline"
                  onClick={() => {
                    setIsFlipped(true);
                    setShowOtp(false);
                    setError("");
                  }}
                >
                  Create an account
                </button>
              </div>

              {/* Trust badge */}
              <div className="mt-3 text-[11px] text-gray-500">
                By continuing, you agree to our Terms & Privacy.
              </div>
            </div>
          </Card>

          {/* BACK: Sign Up */}
          <Card
            style={{ transform: "rotateY(180deg)", pointerEvents: isFlipped ? "auto" : "none" }}
          >
            <h2 className="text-lg sm:text-2xl font-extrabold mb-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              🎉 Create account
            </h2>
            <p className="text-sm text-gray-600 mb-5">Sign up and verify via SMS OTP</p>

            <div className="grid gap-3 sm:gap-4">
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2.5 rounded-md text-sm sm:text-base focus:ring-4 focus:ring-emerald-400/50 pl-9 pr-3 shadow-sm"
                />
              </div>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border p-2.5 rounded-md text-sm sm:text-base focus:ring-4 focus:ring-emerald-400/50 pl-9 pr-3 shadow-sm"
                />
              </div>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full border p-2.5 rounded-md text-sm sm:text-base focus:ring-4 focus:ring-emerald-400/50 pl-9 pr-3 shadow-sm"
                />
              </div>
              <div className="relative">
                <Gift size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Referral code (optional)"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  className="w-full border p-2.5 rounded-md text-sm sm:text-base focus:ring-4 focus:ring-emerald-400/50 pl-9 pr-3 shadow-sm"
                />
              </div>

              <div className="flex gap-2">
                <span className="px-3 flex items-center bg-gray-100 text-gray-600 rounded-md border border-gray-200 shadow-sm">
                  +91
                </span>
                <div className="relative flex-1">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="10 digit phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    inputMode="numeric"
                    className="flex-1 w-full border p-2.5 rounded-md text-sm sm:text-base focus:ring-4 focus:ring-emerald-400/50 pl-9 pr-3 shadow-sm"
                  />
                </div>
              </div>

              {!showOtp ? (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  onClick={handleSendOtp}
                  disabled={isSending}
                  className="w-full rounded-lg py-2.5 text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 shadow-lg shadow-emerald-600/20"
                >
                  {isSending ? "Sending..." : (
                    <>
                      Send OTP <ArrowRight size={18} className="inline-block ml-1 align-[-2px]" />
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  onClick={handleVerifyOtp}
                  disabled={isVerifying}
                  className="w-full rounded-lg py-2.5 text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 shadow-lg shadow-emerald-600/20"
                >
                  {isVerifying ? "Verifying..." : "Verify & Create account"}
                </motion.button>
              )}
            </div>

            <p className="mt-4 text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <button
                className="text-emerald-700 font-medium hover:underline"
                onClick={() => {
                  setIsFlipped(false);
                  setShowOtp(false);
                  setError("");
                }}
              >
                Sign in
              </button>
            </p>
          </Card>
        </motion.div>

        {/* Toggle pointer-events so only the visible face is interactive */}
        <style jsx>{`
          .pointer-events-none[style*="rotateY(180deg)"] {
            pointer-events: none;
          }
          /* Hide scrollbars (optional) */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
}