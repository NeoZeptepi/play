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
          .site-main { flex:1; padding:1.6rem 2rem 4rem; min-height:0; background:#fff; overflow:auto; color:#222; }
          .site-footer { position:fixed; bottom:0; left:0; right:0; background:#222; color:#fff; padding:.55rem 1.25rem; text-align:center; font-size:.9rem; letter-spacing:.03em; z-index:50; transition:transform 200ms ease, opacity 200ms ease; }
          /* Hide footer initially on small heights */
          @media (max-height: 760px) { .site-footer { transform:translateY(100%); opacity:0; } .site-main:focus-within ~ .site-footer, .site-main:hover ~ .site-footer { transform:translateY(0); opacity:1; } }

          /* Tighten spacing progressively */
          @media (max-width: 1200px) {
            .site-nav { width:190px; padding:1.3rem .65rem .65rem; }
            .site-main { padding:1.3rem 1.1rem 4rem; }
            .site-header { padding:.8rem 1.25rem; font-size:1.25rem; }
          }
          @media (max-width: 1080px) {
            .site-nav { width:160px; }
            .site-main { padding:1.15rem .9rem 4rem; }
            .nav-list a { font-size:.9rem; }
          }
          @media (max-width: 1000px) {
            .site-nav { width:140px; padding:1rem .55rem .55rem; }
            .site-main { padding:.9rem .75rem 4rem; }
            .site-header { font-size:1.15rem; }
          }
          /* Stack nav on very narrow widths to reclaim horizontal space for 800px iframe */
          @media (max-width: 940px) {
            .layout-shell { flex-direction:column; }
            .site-nav { width:100%; border-right:none; border-bottom:1px solid #e0e0e0; display:flex; flex-wrap:wrap; gap:.55rem .8rem; padding:.6rem .6rem .4rem; }
            .nav-heading { width:100%; margin:0 0 .25rem; }
            .nav-list { display:flex; flex-wrap:wrap; gap:.45rem .85rem; }
            .nav-list li { margin:0; }
            .site-main { padding:.7rem .6rem 4rem; }
          }
          @media (max-width: 860px) {
            .site-header { padding:.65rem .9rem; font-size:1.05rem; }
            .site-main { padding:.6rem .45rem 4rem; }
            .site-footer { padding:.5rem .85rem; font-size:.8rem; }
          }
          /* Extra narrow devices - reduce header/nav spacing further */
          @media (max-width: 520px) {
            .site-header { padding:.55rem .75rem; font-size:.95rem; }
            .site-nav { padding:.5rem .5rem .35rem; }
            .site-main { padding:.5rem .4rem 4rem; }
          }
        `}</style>
      </body>
    </html>
  );
}
