import React from 'react';
import { Flag } from 'lucide-react';
import { Button } from '../components/ui/Button';

const SpanishMode = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      className="bg-red-500 hover:bg-red-600 text-white ml-2"
    >
      <Flag className="w-4 h-4 mr-2" />
      {language === 'es' ? 'English' : 'Español'}
    </Button>
  );
};

export default SpanishMode;
