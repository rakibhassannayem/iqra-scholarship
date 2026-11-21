import AboutSection from "@/components/public/homePage/AboutSection";
import Hero from "@/components/public/homePage/Hero";
import LatestNews from "@/components/public/homePage/LatestNews";
import NoticeBanner from "@/components/public/homePage/NoticeBanner";
import QuickLinks from "@/components/public/homePage/QuickLinks";
import UpcomingEvents from "@/components/public/homePage/UpcomingEvents";
import SplashScreen from "@/components/public/splash/SplashScreen";

export default function Home() {
  return (
    <>
      <SplashScreen />
      <NoticeBanner />
      <Hero />
      <UpcomingEvents />
      <QuickLinks />
      <LatestNews />
      <AboutSection />
    </>
  );
}
