'use client';

import React from 'react';

const StructuredData: React.FC = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mealzee",
    "alternateName": "Mealzee Tiffin Service",
    "url": "https://mealzee.in",
    "logo": "https://mealzee.in/logo_resized_for_web.png",
    "description": "Mealzee delivers fresh, homemade tiffin meals to your doorstep in Bokaro Steel City. Healthy meal plans for breakfast, lunch, dinner and combos.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bokaro Steel City",
      "addressRegion": "Jharkhand",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9204666105",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://www.facebook.com/mealzee",
      "https://www.instagram.com/mealzee",
      "https://twitter.com/mealzee"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mealzee",
    "image": "https://mealzee.in/logo_resized_for_web.png",
    "description": "Fresh homemade tiffin service delivering healthy meals daily in Bokaro Steel City",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bokaro Steel City",
      "addressRegion": "Jharkhand",
      "postalCode": "827004",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.6693,
      "longitude": 86.1511
    },
    "url": "https://mealzee.in",
    "telephone": "+91-9204666105",
    "servesCuisine": ["Indian", "Vegetarian", "Non-Vegetarian"],
    "priceRange": "₹₹",
    "openingHours": "Mo-Su 06:00-22:00",
    "paymentAccepted": ["Cash", "UPI", "Online Payment"],
    "currenciesAccepted": "INR"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mealzee",
    "url": "https://mealzee.in",
    "description": "Order fresh homemade tiffin meals online. Healthy meal plans delivered daily in Bokaro Steel City.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://mealzee.in/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const foodEstablishmentSchema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "name": "Mealzee",
    "image": "https://mealzee.in/logo_resized_for_web.png",
    "description": "Homemade tiffin service providing fresh, healthy meals delivered to your doorstep",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bokaro Steel City",
      "addressRegion": "Jharkhand",
      "addressCountry": "IN"
    },
    "telephone": "+91-9204666105",
    "url": "https://mealzee.in",
    "servesCuisine": ["Indian", "Vegetarian", "Non-Vegetarian"],
    "hasMenu": {
      "@type": "Menu",
      "name": "Mealzee Meal Plans",
      "description": "Healthy meal plans including breakfast, lunch, dinner and combo options"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(foodEstablishmentSchema),
        }}
      />
    </>
  );
};

export default StructuredData;
