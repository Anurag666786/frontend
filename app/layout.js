import "./globals.css";
import Navbar from "@/components/ui/Navbar";

export const metadata = {
  title: "Blog",
  description: "Created for blogging",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
