import React from 'react';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BrasilMode = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      className="bg-green-500 hover:bg-green-600 text-white"
    >
      <Flag className="w-4 h-4 mr-2" />
      {language === 'en' ? 'Português' : 'English'}
    </Button>
  );
};

export default BrasilMode;
