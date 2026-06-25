import "./globals.css";

export const metadata = {
  title: "AI Code Companion",
  description: "Microservices AI developer assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
