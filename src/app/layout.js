import "./globals.css";

export const metadata = {
  title: "Icon Forge - PWA Icon Generator",
  description: "Generate production-ready PWA icons instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}