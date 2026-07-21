import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { FeedbackDialog } from "@/components/shared/feedback-dialog";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <FeedbackDialog />
    </>
  );
}
