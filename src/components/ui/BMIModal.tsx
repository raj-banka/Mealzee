"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity } from "lucide-react";

interface BMIModalProps {
  open: boolean;
  onClose: () => void;
}

function classifyBMI(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600", ring: "ring-blue-400" };
  if (bmi < 24.9) return { label: "Normal", color: "text-green-600", ring: "ring-green-400" };
  if (bmi < 29.9) return { label: "Overweight", color: "text-amber-600", ring: "ring-amber-400" };
  return { label: "Obese", color: "text-red-600", ring: "ring-red-400" };
}

const BMIModal: React.FC<BMIModalProps> = ({ open, onClose }) => {
  const [heightCm, setHeightCm] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");

  const bmi = useMemo(() => {
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    if (!h || !w || h <= 0 || w <= 0) return null;
    const meters = h / 100;
    const value = w / (meters * meters);
    return Math.round(value * 10) / 10; // one decimal
  }, [heightCm, weightKg]);

  const classification = bmi !== null ? classifyBMI(bmi) : null;

  const healthyRange = useMemo(() => {
    const h = parseFloat(heightCm);
    if (!h || h <= 0) return null;
    const meters = h / 100;
    const min = 18.5 * meters * meters;
    const max = 24.9 * meters * meters;
    return {
      min: Math.round(min * 10) / 10,
      max: Math.round(max * 10) / 10,
    };
  }, [heightCm]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10020] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Card - calculator look */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full max-w-md bg-gradient-to-br from-white to-olive-50 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-olive-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-olive-200/60 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-olive-600 text-white flex items-center justify-center shadow">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">BMI Calculator</h3>
              </div>
              <button
                aria-label="Close"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Height (cm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      placeholder="170"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      className="w-full rounded-2xl border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">cm</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      placeholder="65"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      className="w-full rounded-2xl border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="rounded-2xl bg-white ring-1 ring-olive-200 p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Your BMI</div>
                      <div className="text-3xl font-semibold text-gray-900">{bmi ?? "--"}</div>
                    </div>
                    <div className={`text-right ${classification?.color ?? "text-gray-400"}`}>
                      <div className="text-xs">Category</div>
                      <div className="text-sm font-medium">{classification?.label ?? "--"}</div>
                    </div>
                  </div>
                </div>

                {healthyRange && (
                  <div className="col-span-2 text-xs text-gray-600">
                    Healthy weight for your height: {healthyRange.min}–{healthyRange.max} kg
                  </div>
                )}

               
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-white/70 border-t border-olive-200/60 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setHeightCm("");
                  setWeightKg("");
                }}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-xl bg-olive-600 hover:bg-olive-700 text-white shadow cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BMIModal;