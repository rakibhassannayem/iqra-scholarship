import type { Metadata } from "next";
import DownloadAdmitHero from "@/components/public/download-admit/DownloadAdmitHero";
import DownloadAdmitLookup from "@/components/public/download-admit/DownloadAdmitLookup";

export const metadata: Metadata = {
  title: "প্রবেশপত্র ডাউনলোড (Download Admit) | ইকরা শিক্ষা পরিবার",
  description:
    "নিবন্ধিত শিক্ষার্থীরা তাদের Student ID নম্বর দিয়ে যেকোনো সময় পরীক্ষার প্রবেশপত্র (Admit Card) অনুসন্ধান, ডাউনলোড এবং প্রিন্ট করতে পারবেন।",
};

export default function DownloadAdmitPage() {
  return (
    <>
      <DownloadAdmitHero />
      <DownloadAdmitLookup />
    </>
  );
}
