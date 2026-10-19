import NoticeHero from "@/components/public/notices/NoticeHero";
import NoticeTable from "@/components/public/notices/NoticeTable";

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
