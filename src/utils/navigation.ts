/**
 * Navigation utilities for proper button functionality
 */

/**
 * Smooth scroll to a section by ID
 */
export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId.replace('#', ''));
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

/**
 * Scroll to menu section
 */
export const scrollToMenu = () => {
  scrollToSection('menu');
};

/**
 * Scroll to offers section
 */
export const scrollToOffers = () => {
  scrollToSection('specials');
};

/**
 * Scroll to about section
 */
export const scrollToAbout = () => {
  scrollToSection('about');
};

/**
 * Scroll to contact section
 */
export const scrollToContact = () => {
  scrollToSection('contact');
};

/**
 * Scroll to how it works section
 */
export const scrollToHowItWorks = () => {
  scrollToSection('how-it-works');
};

/**
 * Navigate to a specific page
 */
export const navigateToPage = (path: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
};

/**
 * Open external link in new tab
 */
export const openExternalLink = (url: string) => {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

/**
 * Start ordering process - scroll to menu and highlight it
 */
export const startOrdering = () => {
  scrollToMenu();
  
  // Add a subtle highlight effect to the menu section
  setTimeout(() => {
    const menuElement = document.getElementById('menu');
    if (menuElement) {
      menuElement.classList.add('ring-4', 'ring-emerald-200', 'ring-opacity-50');
      setTimeout(() => {
        menuElement.classList.remove('ring-4', 'ring-emerald-200', 'ring-opacity-50');
      }, 2000);
    }
  }, 500);
};

/**
 * Show all offers - scroll to specials section and highlight
 */
export const showAllOffers = () => {
  scrollToOffers();
  
  // Add a subtle highlight effect to the specials section
  setTimeout(() => {
    const specialsElement = document.getElementById('specials');
    if (specialsElement) {
      specialsElement.classList.add('ring-4', 'ring-emerald-200', 'ring-opacity-50');
      setTimeout(() => {
        specialsElement.classList.remove('ring-4', 'ring-emerald-200', 'ring-opacity-50');
      }, 2000);
    }
  }, 500);
};

/**
 * Explore content - scroll through sections with animation
 */
export const exploreContent = () => {
  // First scroll to popular cuisines, then menu
  scrollToSection('popular-cuisines');
  
  setTimeout(() => {
    scrollToMenu();
  }, 1500);
};
