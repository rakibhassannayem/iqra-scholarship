import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [backgroundSetting] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "public_background"))
    .limit(1);

  const backgroundImage = backgroundSetting?.value ?? "/images/bg3.png";

  return (
    <div
      className="flex min-h-screen flex-col bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <Navbar />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
