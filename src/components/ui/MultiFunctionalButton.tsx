"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calculator, User, Calendar, X, Sparkles } from "lucide-react";
import BMIModal from "@/components/ui/BMIModal";
import UserProfileModal from "@/components/user/UserProfileModal";
import TodaysMenuModal from "@/components/ui/TodaysMenuModal";

interface FunctionButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  gradient: string;
  shadowColor: string;
  action: () => void;
}

const MultiFunctionalButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBmiOpen, setIsBmiOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced function buttons with mixed theme colors
  const functions: FunctionButton[] = [
    {
      id: "bmi",
      icon: <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "BMI Calculator",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/30",
      action: () => {
        setIsBmiOpen(true);
        setIsOpen(false);
      }
    },
    {
      id: "profile",
      icon: <User className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "User Profile",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      shadowColor: "shadow-purple-500/30",
      action: () => {
        setIsProfileOpen(true);
        setIsOpen(false);
      }
    },
    {
      id: "menu",
      icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "Today's Menu",
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
      shadowColor: "shadow-green-500/30",
      action: () => {
        setIsMenuOpen(true);
        setIsOpen(false);
      }
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };



  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {/* Floating particles for visual enhancement */}
        {!isOpen && (
          <>
            <motion.div
              animate={{
                y: [0, -15, 0],
                x: [0, 8, -8, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [0.8, 1.1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2 w-2 h-2 bg-olive-400/60 rounded-full pointer-events-none"
            />
            <motion.div
              animate={{
                y: [0, -12, 0],
                x: [0, -6, 6, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [0.9, 1.2, 0.9]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-emerald-400/50 rounded-full pointer-events-none"
            />
            <motion.div
              animate={{
                y: [0, -8, 0],
                x: [0, 4, -4, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [0.7, 1.0, 0.7]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-1 -left-2 w-1 h-1 bg-teal-400/40 rounded-full pointer-events-none"
            />
          </>
        )}

        {/* Unified Button Container - Plus button included */}
        <motion.div
          className="relative flex items-center"
          animate={{
            width: isOpen ? "auto" : "56px"
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Function Buttons Container */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full p-2 mr-2 shadow-xl border border-white/20"
              >
                {functions.map((func, index) => (
                  <motion.button
                    key={func.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ delay: index * 0.03, duration: 0.15 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={func.action}
                    className={`
                      w-10 h-10 sm:w-11 sm:h-11 rounded-full ${func.gradient}
                      text-white shadow-lg flex items-center justify-center
                      transition-all duration-200 group relative border-2 border-white/40
                      hover:border-white/70 hover:shadow-xl
                    `}
                    aria-label={func.label}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      {func.icon}
                    </motion.div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                      {func.label}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Plus Button */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 25px rgba(139, 154, 70, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`
              w-13 h-13 sm:w-14 sm:h-14 rounded-full
              bg-gradient-to-br from-olive-500 to-olive-600
              hover:from-olive-400 hover:to-olive-500
              text-white shadow-xl flex items-center justify-center
              relative z-10 border-2 border-white/30 backdrop-blur-sm
              transition-all duration-300 group
              ${isOpen ? 'shadow-glow-olive' : 'shadow-soft'}
            `}
            aria-label={isOpen ? "Close menu" : "Open multifunctional menu"}
          >
            {/* Sparkle icon when hovered */}
            <AnimatePresence>
              {isHovered && !isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main icon */}
            <motion.div
              animate={{
                rotate: isOpen ? 45 : 0,
                scale: isOpen ? 1.1 : 1
              }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 200
              }}
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-2 text-white" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Enhanced multi-layer pulse animation when closed */}
        {!isOpen && (
          <>
            {/* Primary pulse with olive theme */}
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-olive-500/25 pointer-events-none"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 0, 0.4]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Secondary pulse with emerald accent */}
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-emerald-500/15 pointer-events-none"
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            {/* Tertiary pulse with teal accent */}
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-teal-500/10 pointer-events-none"
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.2, 0, 0.2]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.0
              }}
            />
          </>
        )}

        {/* Enhanced background overlay with gradient when open */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{
                opacity: 1,
                backdropFilter: "blur(8px)",
                background: [
                  "radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
                  "radial-gradient(circle at center, rgba(139,154,70,0.1) 0%, rgba(0,0,0,0.4) 100%)"
                ]
              }}
              exit={{
                opacity: 0,
                backdropFilter: "blur(0px)",
                transition: { duration: 0.3 }
              }}
              className="fixed inset-0 -z-10"
              onClick={() => setIsOpen(false)}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <BMIModal open={isBmiOpen} onClose={() => setIsBmiOpen(false)} />
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <TodaysMenuModal open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default MultiFunctionalButton;
