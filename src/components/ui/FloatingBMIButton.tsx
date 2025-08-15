"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const FloatingBMIButton: React.FC = () => {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open BMI Calculator"
        onClick={() => router.push("/bmi")}
        className="w-14 h-14 rounded-full bg-olive-600 hover:bg-olive-700 text-white shadow-lg flex items-center justify-center"
      >
        <Activity className="w-6 h-6" />
      </motion.button>
      {/* Subtle pulse to draw attention */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-olive-600/70"
        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default FloatingBMIButton;