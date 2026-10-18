export const translations = {
  bn: {
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    register: "নিবন্ধন",
    result: "ফলাফল দেখুন",
    language: "বাং / EN",
  },
  en: {
    home: "Home",
    about: "About Us",
    contact: "Contact",
    register: "Register",
    result: "Check Result",
    language: "বাং / EN",
  },
} as const;

export type Language = keyof typeof translations;
