/**
 * Smoothly scrolls to the element with the specified ID
 */
export const scrollToElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

/**
 * Handles navigation to a section on the same or different page
 */
export const navigateToSection = (
  elementId: string, 
  isHomePage: boolean,
  navigate?: (path: string) => void
): void => {
  if (isHomePage) {
    scrollToElement(elementId);
  } else if (navigate) {
    navigate(`/#${elementId}`);
  }
};
