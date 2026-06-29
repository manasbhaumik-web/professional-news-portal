import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PortalTheme = 'dark' | 'light' | 'sepia';
export type CleanTheme = 'midnight' | 'charcoal' | 'sepia';
export type CleanFontSize = 'sm' | 'md' | 'lg' | 'xl';

interface ThemeContextType {
  portalTheme: PortalTheme;
  setPortalTheme: (theme: PortalTheme) => void;
  isCleanMode: boolean;
  setIsCleanMode: (isClean: boolean) => void;
  cleanTheme: CleanTheme;
  setCleanTheme: (theme: CleanTheme) => void;
  cleanFontSize: CleanFontSize;
  setCleanFontSize: (size: CleanFontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [portalTheme, setPortalTheme] = useState<PortalTheme>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPortalTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  const [isCleanMode, setIsCleanMode] = useState(false);
  const [cleanTheme, setCleanTheme] = useState<CleanTheme>('midnight');
  const [cleanFontSize, setCleanFontSize] = useState<CleanFontSize>('md');

  return (
    <ThemeContext.Provider
      value={{
        portalTheme,
        setPortalTheme,
        isCleanMode,
        setIsCleanMode,
        cleanTheme,
        setCleanTheme,
        cleanFontSize,
        setCleanFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
