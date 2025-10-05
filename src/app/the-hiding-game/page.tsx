import Script from "next/script";
import React from "react";
import styles from './page.module.css';

export default function HidingGame() {
  return (
    <>
      {/* Load required CSS */}
      <link rel="stylesheet" href="/the-hiding-game/css/general.css" />
      <link rel="stylesheet" href="/the-hiding-game/css/dev1.css" />
      <link rel="stylesheet" href="/the-hiding-game/css/debug.css" />
      <link rel="stylesheet" href="/the-hiding-game/js/jquery/ui/css/ui-lightness/jquery-ui-1.8.16.custom.css" />

      {/* Load required JS (jQuery, jQuery UI, game logic) */}
      <Script src="/the-hiding-game/js/jquery/jquery-1.6.3.js" strategy="beforeInteractive" />
      <Script src="/the-hiding-game/js/jquery/ui/js/jquery-ui-1.8.16.custom.min.js" strategy="beforeInteractive" />
      <Script src="/the-hiding-game/js/dev1.js" strategy="afterInteractive" />

      {/* Main game container */}
      <div className={`container ${styles.container}`}>
        <div className="temp_small_type" id="d_header">
          <div id="d_logo">
            <div id="logoFX01" className="logoFXdiv">
              <img src="/the-hiding-game/images/interface/logoFX/whiteSwipe.png" className="logoFXimg" alt="whiteSwipe" />
            </div>
            <div id="logoFX02" className="logoFXdiv">
              <img src="/the-hiding-game/images/interface/logoFX/redDot.png" className="logoFXimg" alt="redDot" />
            </div>
            <div id="logoFX03" className="logoFXdiv">
              <img id="logoFX03img" src="/the-hiding-game/images/interface/logoFX/star.png" className="logoFXimg" alt="star" />
            </div>
            <div id="d_logo_mask"></div>
          </div>
        </div>
        <div id="d_main">
          {[...Array(10)].map((_, i) => (
            <div key={i} id={`stone${i+1}`} className="stones" style={{display: 'none'}}></div>
          ))}
          <div id="d_hidden" style={{background: '#FFF', position: 'absolute', display: 'block'}}></div>
          <div id="d_showing" style={{background: '#FFF', position: 'absolute', display: 'block'}}></div>
          <div id="d_hand"></div>
        </div>
        <div className="temp_small_type" id="d_footer">
          <div id="d_number_yes">
            <img id="d_num_fx_star1" src="/the-hiding-game/images/interface/logoFX/star.png" width={10} height={10} alt="star" />
            <img id="d_num_fx_star2" src="/the-hiding-game/images/interface/logoFX/star.png" width={10} height={10} alt="star" />
            <img id="d_num_fx_star3" src="/the-hiding-game/images/interface/logoFX/star.png" width={10} height={10} alt="star" />
          </div>
          <div id="d_number_no">&nbsp;</div>
          <div id="d_numbers">
            {[...Array(11)].map((_, i) => (
              <img key={i} src={`/the-hiding-game/images/numbers/${i}.png`} className="number" alt={`number${i}`} />
            ))}
          </div>
          <div id="d_heartBeat">&copy;</div>
        </div>
        <div id="d_leftbar"></div>
        <div id="d_pad">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="pad_number"><img src={`/the-hiding-game/images/numbers/${i+1}.png`} className="number" alt={`pad${i+1}`} /></div>
          ))}
          <div id="d_pad_text">Select a Starting Number</div>
        </div>
        <div id="d_pad_number_selected"><img src="/the-hiding-game/images/numbers/1.png" alt="selected" /></div>
        {/*
        <div id="d_intro_dialog">
          <img src="/the-hiding-game/images/dialogs/screen_example.png" alt="The Hiding Game Example" name="d_intro_image" width={400} height={285} id="d_intro_image" />
        </div>
        */}
      </div>

      <div id="d_results">
        <div className="result_entry" style={{textDecoration: 'underline'}}>Results</div>
      </div>
      <div id="d_fx">LogoFX</div>
      <div id="d_copywrite">&copy; 2012 Patrick Garrett</div>
    </>
  );
}