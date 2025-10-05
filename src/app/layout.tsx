import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Garrett.org Games",
  description: "Small collection of legacy + new games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ width: '100%', background: '#222', color: '#fff', padding: '1rem 2rem', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.05em', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          Play games on Garrett.org
        </header>
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <nav style={{ width: 220, background: '#f5f5f5', borderRight: '1px solid #e0e0e0', padding: '2rem 1rem 1rem 1rem', boxSizing: 'border-box', minHeight: '0' }}>
            <div style={{ fontWeight: 600, marginBottom: '1.5rem', fontSize: '1.1rem', color: '#333' }}>
              <a href="/" style={{ color: '#222', textDecoration: 'none' }}>Games</a>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '1rem' }}><a href="/the-hiding-game" style={{ color: '#222', textDecoration: 'none', fontWeight: 500 }}>The Hiding Game</a></li>
              <li style={{ marginBottom: '1rem' }}><a href="/match-ten" style={{ color: '#222', textDecoration: 'none', fontWeight: 500 }}>Match Ten</a></li>
              <li style={{ marginBottom: '1rem' }}><a href="/match-ten-dice" style={{ color: '#222', textDecoration: 'none', fontWeight: 500 }}>Match Ten Dice</a></li>
              <li style={{ marginBottom: '1rem' }}><a href="/double-addend" style={{ color: '#222', textDecoration: 'none', fontWeight: 500 }}>Double Addend</a></li>
            </ul>
          </nav>
          <main style={{ flex: 1, padding: '2rem', minHeight: 0, background: '#fff', overflow: 'auto', paddingBottom: '4rem', color: '#222' }}>
            {children}
          </main>
        </div>
        <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '100%', background: '#222', color: '#fff', padding: '0.75rem 2rem', textAlign: 'center', fontSize: '1rem', letterSpacing: '0.03em', zIndex: 50 }}>
          &copy; {new Date().getFullYear()} Garrett.org &mdash; Play for fun!
        </footer>
      </body>
    </html>
  );
}
