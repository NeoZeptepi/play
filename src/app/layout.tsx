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
  const buildStamp = new Date().toISOString();
  return (
    <html lang="en" data-build={new Date().toISOString()}>
      <body className={`${geistSans.variable} ${geistMono.variable} site-body`} data-build={buildStamp}>
        <header className="site-header">Play games on Garrett.org</header>
        <div className="layout-shell">
          <nav className="site-nav">
            <div className="nav-heading"><a href="/">Games</a></div>
            <ul className="nav-list">
              <li><a href="/the-hiding-game">The Hiding Game</a></li>
              <li><a href="/match-ten">Match Ten</a></li>
              <li><a href="/match-ten-dice">Make 10 Dice</a></li>
              <li><a href="/double-addend">Double Addend</a></li>
            </ul>
          </nav>
          <main className="site-main">{children}</main>
        </div>
        <footer className="site-footer">&copy; {new Date().getFullYear()} Garrett.org &mdash; Play for fun! <span className="build-stamp">Build: {buildStamp}</span></footer>
        <style>{`
          .site-body { margin:0; padding:0; min-height:100vh; display:flex; flex-direction:column; }
          .site-header { width:100%; background:#222; color:#fff; padding:.75rem 1.25rem; font-size:1.3rem; font-weight:700; letter-spacing:.05em; box-shadow:0 2px 8px rgba(0,0,0,0.04); line-height:1.15; }
          .layout-shell { display:flex; flex:1; min-height:0; }
          .site-nav { width:220px; background:#f5f5f5; border-right:1px solid #e0e0e0; padding:2rem 1rem 1rem; box-sizing:border-box; }
          .nav-heading { font-weight:600; margin-bottom:1.4rem; font-size:1.05rem; color:#333; }
          .nav-heading a { color:#222; text-decoration:none; }
            .nav-list { list-style:none; margin:0; padding:0; }
            .nav-list li { margin-bottom:1rem; }
            .nav-list a { color:#222; text-decoration:none; font-weight:500; font-size:.95rem; }
          .site-main { flex:1; padding:.85rem 1.35rem 3.5rem; min-height:0; background:#fff; overflow:auto; color:#222; }
          .site-main > h1:first-child { margin-top:0; }
          .site-footer { position:fixed; bottom:0; left:0; right:0; background:#222; color:#fff; padding:.5rem 1.1rem; text-align:center; font-size:.75rem; letter-spacing:.03em; z-index:50; transform:translateY(100%); opacity:0; transition:transform .35s ease, opacity .35s ease; }
          .build-stamp { margin-left:.75rem; opacity:0; font-weight:400; letter-spacing:0; font-size:.6rem; color:#999; transition:opacity .3s ease; }
          .site-footer:hover .build-stamp { opacity:.75; }
          .show-footer .site-footer { transform:translateY(0); opacity:1; }
          /* Provide extra bottom padding so content not obscured when footer slides in */
          .show-footer .site-main { padding-bottom:4.5rem; }

          /* Tighten spacing progressively */
          @media (max-width: 1200px) {
            .site-nav { width:190px; padding:1rem .55rem .55rem; }
            .site-main { padding:.8rem .85rem 3.1rem; }
            .site-header { padding:.65rem 1.05rem; font-size:1.2rem; }
          }
          @media (max-width: 1080px) {
            .site-nav { width:160px; }
            .site-main { padding:.7rem .7rem 3rem; }
            .nav-list a { font-size:.9rem; }
          }
          /* Additional compression before stacked nav engages */
          @media (max-width: 1040px) {
            .site-nav { width:150px; padding:.85rem .5rem .5rem; }
            .site-main { padding:.65rem .6rem 2.85rem; }
            .site-header { font-size:1.15rem; }
          }
          /* Stack nav on very narrow widths to reclaim horizontal space for 800px iframe */
          /* Stacked / inline nav earlier (<= 1000px) */
          @media (max-width: 1000px) {
            .layout-shell { flex-direction:column; }
            .site-nav { width:100%; border-right:none; border-bottom:1px solid #e0e0e0; display:flex; flex-wrap:wrap; align-items:center; gap:.35rem .55rem; padding:.35rem .45rem .25rem; }
            .nav-heading { width:auto; margin:0 .5rem 0 0; font-size:.9rem; line-height:1; }
            .nav-heading a { display:inline-block; padding:.2rem .4rem; background:#eee; border-radius:4px; font-weight:600; }
            .nav-list { display:flex; flex-wrap:wrap; gap:.3rem .55rem; }
            .nav-list li { margin:0; }
            .nav-list a { font-size:.8rem; padding:.2rem .35rem; border-radius:4px; }
            .nav-list a:hover { background:#ececec; }
            .site-main { padding:.45rem .45rem 2.5rem; }
          }
          @media (max-width: 860px) {
            .site-header { padding:.5rem .7rem; font-size:1rem; }
            .site-main { padding:.4rem .35rem 2.35rem; }
            .site-footer { padding:.45rem .7rem; font-size:.72rem; }
          }
          /* Extra narrow devices - reduce header/nav spacing further */
          @media (max-width: 520px) {
            .site-header { padding:.45rem .55rem; font-size:.92rem; }
            .site-nav { padding:.3rem .35rem .25rem; }
            .site-main { padding:.35rem .3rem 2rem; }
          }
        `}</style>
        <script dangerouslySetInnerHTML={{__html:`(function(){const root=document.documentElement;const body=document.body;function check(){var sc=(window.scrollY||window.pageYOffset);var vh=window.innerHeight;var h=body.scrollHeight; if(sc+vh>=h-8){body.classList.add('show-footer');} else {body.classList.remove('show-footer');}};window.addEventListener('scroll',check,{passive:true});window.addEventListener('resize',check);document.addEventListener('DOMContentLoaded',check);check();})();`}} />
      </body>
    </html>
  );
}
