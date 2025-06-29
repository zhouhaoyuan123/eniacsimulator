import React from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { LanguageProvider } from './providers/LanguageProvider';
import { ENIACSimulator } from './components/ENIACSimulator';
import { SEOHead } from './components/SEOHead';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SEOHead />
        <ENIACSimulator />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;