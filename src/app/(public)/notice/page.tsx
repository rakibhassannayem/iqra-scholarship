import NoticeHero from "@/components/public/notice/NoticeHero";
import NoticeTable from "@/components/public/notice/NoticeTable";

export default function NoticePage() {
  return (
    <>
      <NoticeHero />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <NoticeTable />
      </section>
    </>
  );
}
