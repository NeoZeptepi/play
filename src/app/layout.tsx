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
      <body className={`${geistSans.variable} ${geistMono.variable} site-body`}>
        <header className="site-header">Play games on Garrett.org</header>
        <div className="layout-shell">
          <nav className="site-nav">
            <div className="nav-heading"><a href="/">Games</a></div>
            <ul className="nav-list">
              <li><a href="/the-hiding-game">The Hiding Game</a></li>
              <li><a href="/match-ten">Match Ten</a></li>
              <li><a href="/match-ten-dice">Match Ten Dice</a></li>
              <li><a href="/double-addend">Double Addend</a></li>
            </ul>
          </nav>
          <main className="site-main">{children}</main>
        </div>
        <footer className="site-footer">&copy; {new Date().getFullYear()} Garrett.org &mdash; Play for fun!</footer>
        <style>{`
          .site-body { margin:0; padding:0; min-height:100vh; display:flex; flex-direction:column; }
          .site-header { width:100%; background:#222; color:#fff; padding:1rem 2rem; font-size:1.4rem; font-weight:700; letter-spacing:.05em; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
          .layout-shell { display:flex; flex:1; min-height:0; }
          .site-nav { width:220px; background:#f5f5f5; border-right:1px solid #e0e0e0; padding:2rem 1rem 1rem; box-sizing:border-box; }
          .nav-heading { font-weight:600; margin-bottom:1.4rem; font-size:1.05rem; color:#333; }
          .nav-heading a { color:#222; text-decoration:none; }
            .nav-list { list-style:none; margin:0; padding:0; }
            .nav-list li { margin-bottom:1rem; }
            .nav-list a { color:#222; text-decoration:none; font-weight:500; font-size:.95rem; }
          .site-main { flex:1; padding:2rem; padding-bottom:4rem; min-height:0; background:#fff; overflow:auto; color:#222; }
          .site-footer { position:fixed; bottom:0; left:0; right:0; background:#222; color:#fff; padding:.65rem 1.5rem; text-align:center; font-size:.95rem; letter-spacing:.03em; z-index:50; }

          /* Tighten spacing progressively */
          @media (max-width: 1200px) {
            .site-nav { width:190px; padding:1.5rem .75rem .75rem; }
            .site-main { padding:1.5rem 1.25rem 4rem; }
            .site-header { padding:.85rem 1.5rem; }
          }
          @media (max-width: 1080px) {
            .site-nav { width:160px; }
            .site-main { padding:1.25rem 1rem 4rem; }
            .nav-list a { font-size:.9rem; }
          }
          @media (max-width: 1000px) {
            .site-nav { width:140px; padding:1.25rem .6rem .6rem; }
            .site-main { padding:1rem .85rem 4rem; }
            .site-header { font-size:1.25rem; }
          }
          /* Stack nav on very narrow widths to reclaim horizontal space for 800px iframe */
          @media (max-width: 940px) {
            .layout-shell { flex-direction:column; }
            .site-nav { width:100%; border-right:none; border-bottom:1px solid #e0e0e0; display:flex; flex-wrap:wrap; gap:.75rem 1rem; padding:.75rem .75rem .5rem; }
            .nav-heading { width:100%; margin:0 0 .25rem; }
            .nav-list { display:flex; flex-wrap:wrap; gap:.5rem 1rem; }
            .nav-list li { margin:0; }
            .site-main { padding:.85rem .75rem 4rem; }
          }
          @media (max-width: 860px) {
            .site-header { padding:.75rem 1rem; font-size:1.15rem; }
            .site-main { padding:.75rem .5rem 4rem; }
            .site-footer { padding:.55rem 1rem; font-size:.85rem; }
          }
        `}</style>
      </body>
    </html>
  );
}
