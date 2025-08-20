"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Send, Heart, ThumbsUp, MessageCircle } from "lucide-react";

interface RateReviewModalProps {
  open: boolean;
  onClose: () => void;
}

const RateReviewModal: React.FC<RateReviewModalProps> = ({ open, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Auto close after success
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
      setReview("");
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setSubmitted(false);
      setRating(0);
      setReview("");
    }
  };

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
            onClick={handleClose}
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 overflow-hidden"
          >
            {!submitted ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-olive-50 to-emerald-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-olive-600 text-white flex items-center justify-center shadow">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Rate & Review</h3>
                      <p className="text-sm text-gray-600">Share your experience with us</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                    disabled={isSubmitting}
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Rating Section */}
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">How was your meal?</h4>
                    <div className="flex justify-center gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= (hoveredRating || rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      {rating === 0 && "Click to rate"}
                      {rating === 1 && "Poor"}
                      {rating === 2 && "Fair"}
                      {rating === 3 && "Good"}
                      {rating === 4 && "Very Good"}
                      {rating === 5 && "Excellent"}
                    </p>
                  </div>

                  {/* Review Section */}
                  <div>
                    <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                      Write a review (optional)
                    </label>
                    <textarea
                      id="review"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Tell us about your experience..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-500 focus:border-olive-500 resize-none text-sm"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{review.length}/500 characters</p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={rating === 0 || isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-olive-600 hover:bg-olive-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <ThumbsUp className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-4">Your review has been submitted successfully.</p>
                <div className="flex justify-center">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RateReviewModal;