import { Navbar } from "@/components/global/navbar";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar type="landing" />
      {children}
    </>
  );
}
