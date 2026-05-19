/* ────────────────────────────────────────
   WeatherNow – script.js
   All interactivity, AOS init, live clock,
   navbar scroll effect, refresh spin, etc.
──────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════
     1. AOS – Animate on Scroll
  ══════════════════════════════ */
  AOS.init({
    duration: 750,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });


  /* ══════════════════════════════
     2. Navbar – scroll effect
  ══════════════════════════════ */
  const navbar = document.getElementById('mainNavbar');
  const toggler = document.querySelector('.custom-toggler');

  window.addEventListener('scroll', () => {
    const isMenuOpen = toggler && toggler.getAttribute('aria-expanded') === 'true';
    if (window.scrollY > 40 || isMenuOpen) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (toggler) {
    toggler.addEventListener('click', () => {
      setTimeout(() => {
        const isOpen = toggler.getAttribute('aria-expanded') === 'true';
        if (isOpen && window.scrollY <= 40) {
          // Automatically scroll down a tiny bit to trigger the active background naturally
          window.scrollTo({ top: 45, behavior: 'smooth' });
        } else {
          // Re-evaluate the scroll listener to update transparency when closing at the top
          window.dispatchEvent(new Event('scroll'));
        }
      }, 50);
    });
  }


  /* ══════════════════════════════
     3. Live Date & Time
  ══════════════════════════════ */
  const dtEl = document.getElementById('liveDateTime');

  function formatDateTime(d) {
    const days  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const day   = days[d.getDay()];
    const date  = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year  = d.getFullYear();
    let   h     = d.getHours();
    const min   = String(d.getMinutes()).padStart(2, '0');
    const ampm  = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${day}, ${date} ${month} ${year} &nbsp;|&nbsp; ${String(h).padStart(2,'0')}:${min} ${ampm}`;
  }

  function tickClock() {
    dtEl.innerHTML = formatDateTime(new Date());
  }

  tickClock();
  setInterval(tickClock, 60000); // update every minute


  /* ══════════════════════════════
     4. Active Nav Link – click
  ══════════════════════════════ */
  document.querySelectorAll('.nav-links-center .nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.nav-links-center .nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });


  /* ══════════════════════════════
     5. Search – Enter key hint
  ══════════════════════════════ */
  const citySearch = document.getElementById('citySearch');
  if (citySearch) {
    citySearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && citySearch.value.trim()) {
        // Static UI – just animate the input as acknowledgement
        citySearch.style.color = '#facc15';
        setTimeout(() => { citySearch.style.color = '#fff'; }, 800);
      }
    });
  }


  /* ══════════════════════════════
     6. Refresh Button – spin once
  ══════════════════════════════ */
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      const icon = refreshBtn.querySelector('i');
      icon.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1)';
      icon.style.transform  = 'rotate(360deg)';
      setTimeout(() => {
        icon.style.transition = 'none';
        icon.style.transform  = 'rotate(0deg)';
      }, 750);
    });
  }


  /* ══════════════════════════════
     7. Forecast item – click select
  ══════════════════════════════ */
  document.querySelectorAll('.forecast-item').forEach(item => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.forecast-item').forEach(i => i.classList.remove('active-fc'));
      this.classList.add('active-fc');
    });
  });


  /* ══════════════════════════════
     8. Humidity bar – animate on load
  ══════════════════════════════ */
  const humidityFill = document.querySelector('.humidity-fill');
  if (humidityFill) {
    const target = humidityFill.style.width;
    humidityFill.style.width = '0';
    setTimeout(() => {
      humidityFill.style.width = target;
    }, 600);
  }


  /* ══════════════════════════════
     9. Floating hero card effect
  ══════════════════════════════ */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.animation = 'floatY 6s ease-in-out infinite';
  }


  /* ══════════════════════════════
     10. Settings btn – visual toggle
  ══════════════════════════════ */
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      settingsBtn.classList.toggle('active');
    });
  }

});
