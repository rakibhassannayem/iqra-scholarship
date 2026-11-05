import { notFound } from "next/navigation";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { ChevronRight, Calendar, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { aboutPages } from "@/lib/db/schema";
import { Card, CardContent } from "@/components/ui/card";

type DynamicAboutPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DynamicAboutPageProps) {
  const { slug } = await params;

  const [page] = await db
    .select({ title: aboutPages.title })
    .from(aboutPages)
    .where(and(eq(aboutPages.slug, slug), eq(aboutPages.isPublished, true)))
    .limit(1);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: `${page.title} - Iqra Scholarship`,
  };
}

export default async function DynamicAboutPage({
  params,
}: DynamicAboutPageProps) {
  const { slug } = await params;

  const [page] = await db
    .select()
    .from(aboutPages)
    .where(and(eq(aboutPages.slug, slug), eq(aboutPages.isPublished, true)))
    .limit(1);

  if (!page) {
    notFound();
  }

  const formattedDate = new Date(page.updatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/about" className="hover:text-foreground">
          About
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{page.title}</span>
      </nav>

      <Card className="overflow-hidden border border-border/80 bg-card/95 shadow-md backdrop-blur">
        <div className="border-b bg-muted/30 px-6 py-6 sm:px-10">
          <Link
            href="/about"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-3.5" />
            Back to About Overview
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {page.title}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>Last updated: {formattedDate}</span>
          </div>
        </div>

        <CardContent className="px-6 py-8 sm:px-10 sm:py-10">
          {page.content ? (
            <div
              className="prose prose-slate max-w-none dark:prose-invert
                prose-headings:font-bold prose-headings:text-foreground
                prose-h1:text-2xl sm:prose-h1:text-3xl
                prose-h2:text-xl sm:prose-h2:text-2xl
                prose-h3:text-lg sm:prose-h3:text-xl
                prose-p:leading-relaxed prose-p:text-muted-foreground
                prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:italic prose-blockquote:text-foreground
                prose-ul:list-disc prose-ol:list-decimal
                prose-table:w-full prose-table:border-collapse
                prose-th:border prose-th:border-border prose-th:bg-muted/50 prose-th:p-2.5 prose-th:text-left
                prose-td:border prose-td:border-border prose-td:p-2.5
                prose-img:rounded-lg prose-img:shadow-sm"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              This page content is currently empty.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

