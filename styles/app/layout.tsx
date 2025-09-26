import "../styles/globals.css";

export const metadata = {
  title: "Made of Magic",
  description: "Creating unified, future-proofed brands."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
