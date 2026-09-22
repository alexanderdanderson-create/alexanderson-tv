(function () {
  if (localStorage.getItem('aa_popup_dismissed')) return;

  const style = document.createElement('style');
  style.textContent = `
    #aa-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      padding: 20px;
    }
    #aa-overlay.visible { opacity: 1; }
    #aa-popup {
      background: #fff;
      max-width: 480px;
      width: 100%;
      padding: 48px 40px 40px;
      position: relative;
      transform: translateY(16px);
      transition: transform 0.3s ease;
    }
    #aa-overlay.visible #aa-popup { transform: translateY(0); }
    #aa-close {
      position: absolute;
      top: 16px;
      right: 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 20px;
      color: #888;
      line-height: 1;
      padding: 4px;
    }
    #aa-close:hover { color: #111; }
    #aa-eyebrow {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 12px;
    }
    #aa-heading {
      font-family: 'Inter', sans-serif;
      font-size: clamp(22px, 4vw, 30px);
      font-weight: 300;
      letter-spacing: -0.01em;
      color: #111;
      margin-bottom: 12px;
      line-height: 1.2;
    }
    #aa-sub {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    #aa-kit-form { min-height: 78px; }
    #aa-kit-form .formkit-form { margin: 0 !important; }
    #aa-legal {
      margin-top: 16px;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      color: #bbb;
      letter-spacing: 0.03em;
    }
    @media (max-width: 480px) {
      #aa-popup { padding: 40px 24px 32px; }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'aa-overlay';
  overlay.innerHTML = `
    <div id="aa-popup">
      <button id="aa-close" aria-label="Close">&#x2715;</button>
      <p id="aa-eyebrow">Newsletter</p>
      <h2 id="aa-heading">Stay in the loop</h2>
      <p id="aa-sub">Updates on new films, behind-the-scenes, and more from Alex Anderson.</p>
      <div id="aa-kit-form" aria-label="Subscribe to Alex Anderson's mailing list"></div>
      <p id="aa-legal">No spam. Unsubscribe anytime.</p>
    </div>
  `;
  document.body.appendChild(overlay);

  const kitScript = document.createElement('script');
  kitScript.async = true;
  kitScript.dataset.uid = 'f1f1ca217f';
  kitScript.src = 'https://witty-maker-683.kit.com/f1f1ca217f/index.js';
  overlay.querySelector('#aa-kit-form').appendChild(kitScript);

  function dismiss() {
    overlay.classList.remove('visible');
    localStorage.setItem('aa_popup_dismissed', '1');
    setTimeout(() => overlay.remove(), 400);
  }

  overlay.querySelector('#aa-close').addEventListener('click', dismiss);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) dismiss();
  });

  setTimeout(function() { overlay.classList.add('visible'); }, 4000);
})();
