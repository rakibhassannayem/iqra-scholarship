export const translations = {
  bn: {
    // Navbar
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    notice: "নোটিশ",
    contact: "যোগাযোগ",
    register: "নিবন্ধন",
    result: "ফলাফল দেখুন",
    language: "বাং / EN",

    // Homepage - Hero Section
    heroTitle: "মেধার বিকাশে বৃত্তি, আগামীর পথে অগ্রগতি",
    heroDescription:
      "মাদ্রাসার শিক্ষার্থীদের বৃত্তি নিবন্ধন, পরীক্ষার তথ্য ও ফলাফল জানার একটি নির্ভরযোগ্য প্ল্যাটফর্ম।",
    registerNow: "বৃত্তির জন্য নিবন্ধন",
    checkResult: "ফলাফল যাচাই করুন",

    // Homepage - Notices Section
    notices: "সর্বশেষ বিজ্ঞপ্তি",

    // Homepage - Upcoming Events Section
    upcomingEvents: "আসন্ন পরীক্ষা ও আয়োজন",
    examSchedule: "পরীক্ষার সময়সূচি",
    resultPublication: "ফলাফল প্রকাশ",

    // Homepage - Quick Links Section
    quickLinks: "দ্রুত সেবা",
    scholarshipInfo: "বৃত্তি সম্পর্কে জানুন",
    certificate: "সনদ যাচাই",

    // Homepage - Latest News Section
    latestNews: "সাম্প্রতিক খবর",

    // Homepage - About Section
    aboutScholarship: "আমাদের বৃত্তি কার্যক্রম",

    // Shared
    viewAll: "সব দেখুন",
    learnMore: "আরও জানুন",
  },

  en: {
    // Navbar
    home: "Home",
    about: "About Us",
    notice: "Notice",
    contact: "Contact",
    register: "Register",
    result: "Check Result",
    language: "বাং / EN",

    // Homepage - Hero Section
    heroTitle: "Scholarships That Nurture Talent and Inspire Progress",
    heroDescription:
      "A trusted platform for madrasa students to register for scholarships, explore exam information, and check results.",
    registerNow: "Apply for Scholarship",
    checkResult: "Check Your Result",

    // Homepage - Notices Section
    notices: "Latest Notices",

    // Homepage - Upcoming Events Section
    upcomingEvents: "Upcoming Exams & Events",
    examSchedule: "Exam Schedule",
    resultPublication: "Result Publication",

    // Homepage - Quick Links Section
    quickLinks: "Quick Services",
    scholarshipInfo: "Scholarship Information",
    certificate: "Verify Certificate",

    // Homepage - Latest News Section
    latestNews: "Latest News",

    // Homepage - About Section
    aboutScholarship: "About Our Scholarship Program",

    // Shared
    viewAll: "View All",
    learnMore: "Learn More",
  },
} as const;

export type Language = keyof typeof translations;
