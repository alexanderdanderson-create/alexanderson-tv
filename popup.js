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
    #aa-form {
      display: flex;
      gap: 0;
      border: 1px solid #e8e8e8;
    }
    #aa-email {
      flex: 1;
      border: none;
      outline: none;
      padding: 14px 16px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #111;
      background: #fff;
    }
    #aa-email::placeholder { color: #aaa; }
    #aa-submit {
      background: #111;
      color: #fff;
      border: none;
      padding: 14px 20px;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
    }
    #aa-submit:hover { background: #333; }
    #aa-msg {
      margin-top: 14px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: #888;
      min-height: 18px;
    }
    #aa-msg.success { color: #111; }
    #aa-msg.error { color: #c00; }
    #aa-legal {
      margin-top: 16px;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      color: #bbb;
      letter-spacing: 0.03em;
    }
    @media (max-width: 480px) {
      #aa-popup { padding: 40px 24px 32px; }
      #aa-form { flex-direction: column; }
      #aa-submit { padding: 14px; }
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
      <form id="aa-form">
        <input id="aa-email" type="email" placeholder="Your email address" required autocomplete="email">
        <button id="aa-submit" type="submit">Subscribe</button>
      </form>
      <p id="aa-msg"></p>
      <p id="aa-legal">No spam. Unsubscribe anytime.</p>
    </div>
  `;
  document.body.appendChild(overlay);

  const msg = overlay.querySelector('#aa-msg');

  function dismiss() {
    overlay.classList.remove('visible');
    localStorage.setItem('aa_popup_dismissed', '1');
    setTimeout(() => overlay.remove(), 400);
  }

  overlay.querySelector('#aa-close').addEventListener('click', dismiss);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) dismiss();
  });

  overlay.querySelector('#aa-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = overlay.querySelector('#aa-email').value.trim();
    if (!email) return;
    const btn = overlay.querySelector('#aa-submit');
    btn.textContent = '...';
    btn.disabled = true;

    fetch('https://alexandersonpodcast.substack.com/api/v1/free', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, first_url: window.location.href, referral_code: null })
    })
    .then(function(r) {
      if (r.ok || r.status === 200) {
        msg.textContent = 'You\'re in! Check your inbox to confirm.';
        msg.className = 'success';
        localStorage.setItem('aa_popup_dismissed', '1');
        setTimeout(dismiss, 3000);
      } else {
        throw new Error('error');
      }
    })
    .catch(function() {
      msg.textContent = 'Something went wrong. Try subscribing at newsletter.alexanderson.tv';
      msg.className = 'error';
      btn.textContent = 'Subscribe';
      btn.disabled = false;
    });
  });

  setTimeout(function() { overlay.classList.add('visible'); }, 4000);
})();
