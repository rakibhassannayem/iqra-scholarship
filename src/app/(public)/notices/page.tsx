import NoticeHero from "@/components/public/notices/NoticeHero";
import NoticeTable from "@/components/public/notices/NoticeTable";

export default function NoticePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-25 py-16 sm:py-20 lg:py-24">
        <NoticeTable />
      </section>
    </>
  );
}
