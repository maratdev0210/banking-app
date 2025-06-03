import Navigation from "@/components/ui/cashier/Navigation";

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
