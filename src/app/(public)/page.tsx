import AboutSection from "@/components/public/homePage/AboutSection";
import Hero from "@/components/public/homePage/Hero";
import LatestNews from "@/components/public/homePage/LatestNews";
import NoticeBanner from "@/components/public/homePage/NoticeBanner";
import QuickLinks from "@/components/public/homePage/QuickLinks";
import UpcomingEvents from "@/components/public/homePage/UpcomingEvents";

export default function Home() {
  return (
    <>
      <NoticeBanner />
      <Hero />
      <UpcomingEvents />
      <QuickLinks />
      <LatestNews />
      <AboutSection />
    </>
  );
}
