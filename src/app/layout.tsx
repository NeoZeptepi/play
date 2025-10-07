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
          .site-header { width:100%; background:#222; color:#fff; padding:.9rem 1.5rem; font-size:1.35rem; font-weight:700; letter-spacing:.05em; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
          .layout-shell { display:flex; flex:1; min-height:0; }
          .site-nav { width:220px; background:#f5f5f5; border-right:1px solid #e0e0e0; padding:2rem 1rem 1rem; box-sizing:border-box; }
          .nav-heading { font-weight:600; margin-bottom:1.4rem; font-size:1.05rem; color:#333; }
          .nav-heading a { color:#222; text-decoration:none; }
            .nav-list { list-style:none; margin:0; padding:0; }
            .nav-list li { margin-bottom:1rem; }
            .nav-list a { color:#222; text-decoration:none; font-weight:500; font-size:.95rem; }
          .site-main { flex:1; padding:1.1rem 1.5rem 4rem; min-height:0; background:#fff; overflow:auto; color:#222; }
          .site-main > h1:first-child { margin-top:.15rem; }
          .site-footer { position:fixed; bottom:0; left:0; right:0; background:#222; color:#fff; padding:.5rem 1.1rem; text-align:center; font-size:.85rem; letter-spacing:.03em; z-index:50; }
          /* Vertically constrained: footer becomes normal flow so it only appears when reaching bottom */
          @media (max-height: 760px) { 
            .site-footer { position:static; padding:.65rem 1rem 1rem; }
            .site-main { padding-bottom:1.25rem; }
          }

          /* Tighten spacing progressively */
          @media (max-width: 1200px) {
            .site-nav { width:190px; padding:1.2rem .6rem .6rem; }
            .site-main { padding:1rem .95rem 3.5rem; }
            .site-header { padding:.75rem 1.2rem; font-size:1.25rem; }
          }
          @media (max-width: 1080px) {
            .site-nav { width:160px; }
            .site-main { padding:.9rem .8rem 3.25rem; }
            .nav-list a { font-size:.9rem; }
          }
          @media (max-width: 1000px) {
            .site-nav { width:140px; padding:.85rem .5rem .5rem; }
            .site-main { padding:.75rem .65rem 3rem; }
            .site-header { font-size:1.15rem; }
          }
          /* Stack nav on very narrow widths to reclaim horizontal space for 800px iframe */
          @media (max-width: 940px) {
            .layout-shell { flex-direction:column; }
            .site-nav { width:100%; border-right:none; border-bottom:1px solid #e0e0e0; display:flex; flex-wrap:wrap; gap:.4rem .6rem; padding:.45rem .5rem .3rem; }
            .nav-heading { width:100%; margin:0 0 .15rem; font-size:.95rem; }
            .nav-list { display:flex; flex-wrap:wrap; gap:.35rem .65rem; }
            .nav-list li { margin:0; }
            .nav-list a { font-size:.85rem; }
            .site-main { padding:.55rem .5rem 3rem; }
          }
          @media (max-width: 860px) {
            .site-header { padding:.55rem .8rem; font-size:1.05rem; }
            .site-main { padding:.5rem .4rem 3rem; }
            .site-footer { padding:.5rem .8rem; font-size:.75rem; }
          }
          /* Extra narrow devices - reduce header/nav spacing further */
          @media (max-width: 520px) {
            .site-header { padding:.45rem .65rem; font-size:.95rem; }
            .site-nav { padding:.4rem .4rem .3rem; }
            .site-main { padding:.4rem .35rem 2.25rem; }
          }
        `}</style>
      </body>
    </html>
  );
}
