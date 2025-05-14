import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>{children}</div>
      <Toaster className="bg-green-500 text-white" />
    </>
  );
}
