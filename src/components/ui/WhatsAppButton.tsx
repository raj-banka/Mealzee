'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import BMIModal from '@/components/ui/BMIModal';

const WhatsAppButton: React.FC = () => {
  const [isBmiOpen, setIsBmiOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 cursor-pointer">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsBmiOpen(true)}
        aria-label="Open BMI Calculator"
        className="w-14 h-14 bg-olive-500 hover:bg-olive-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer"
      >
        {/* <MessageCircle className="w-6 h-6" /> */}
         <img
                    src="/images/plus_icon.png"
                    alt="+"
                    className="h-8 w-8"
                  />
      </motion.button>

      {/* Pulse animation */}
      {!isBmiOpen && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-14 h-14 bg-olive-500 rounded-full pointer-events-none"
          aria-hidden
        />
      )}

      {/* BMI Modal */}
      <BMIModal open={isBmiOpen} onClose={() => setIsBmiOpen(false)} />
    </div>
  );
};

export default WhatsAppButton;