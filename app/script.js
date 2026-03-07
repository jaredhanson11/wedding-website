/////////// HERO STYLE BUILDER ///////////
// Populate hero section based on ?style=a (default), ?style=b, or ?style=c
;(function () {
  const style = new URLSearchParams(window.location.search).get('style') || 'a';
  const hero = document.getElementById('hero');
  if (!hero) return;

  const enterBtn = `
    <button id="heroEnterBtn" class="hero-enter-btn mt-4 flex flex-col items-center gap-2 cursor-pointer group">
      <span class="text-white/40 group-hover:text-white/80 transition-colors duration-300 text-[9px] tracking-[0.55em] uppercase font-light">enter</span>
      <svg class="w-4 h-4 text-white/30 group-hover:text-white/70 group-hover:translate-y-0.5 transition-all duration-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
      </svg>
    </button>`;

  if (style === 'a') {
    // Wide: full-bleed B&W photo with centered text overlay (Style A)
    // Narrow: photo stacked on top, text panel below (Style C mobile)
    hero.style.background = '#0a0806';
    hero.className = 'fixed inset-0 overflow-hidden z-110 flex flex-col md:block';
    hero.innerHTML = `
      <!-- Photo: top block on narrow, full-cover on wide -->
      <div class="relative shrink-0 w-full h-[45vh] md:absolute md:inset-0 md:h-full overflow-hidden">
        <img src="assets/home-image.jpg" class="w-full h-full object-cover"
          style="filter: grayscale(100%) brightness(0.5) contrast(1.15); object-position: center 25%;" alt="">
        <!-- Narrow: fade bottom of photo into dark bg -->
        <div class="md:hidden absolute inset-0" style="background: linear-gradient(to bottom, transparent 45%, #0a0806 100%)"></div>
        <!-- Wide: vignette top and bottom -->
        <div class="hidden md:block absolute inset-0" style="background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 65%, rgba(0,0,0,0.8) 100%)"></div>
      </div>
      <!-- Text: below photo on narrow, centered overlay on wide -->
      <div class="flex-1 flex flex-col items-center justify-center px-4 py-6 md:py-0 relative z-10 md:absolute md:inset-0">
        <div class="text-center flex flex-col items-center gap-5">
          <div class="hidden md:flex hero-text-intro items-center gap-3 w-40 sm:w-60">
            <div class="h-px bg-white/30 flex-1"></div>
            <div class="w-1.5 h-1.5 rotate-45 border border-white/30"></div>
            <div class="h-px bg-white/30 flex-1"></div>
          </div>
          <div id="heroTitle" class="font-[Reenie_Beanie] text-6xl sm:text-8xl md:text-9xl text-white hero-text-intro whitespace-nowrap leading-none"><span class="hero-keep">J</span><span class="hero-fade">ared</span> <span class="hero-keep">&amp;</span> <span class="hero-keep">M</span><span class="hero-fade">ackensie</span></div>
          <div id="heroSubtitle" class="hero-text-intro hero-text-intro-delay flex flex-col items-center gap-1.5">
            <div class="text-white/60 text-[10px] sm:text-xs tracking-[0.4em] uppercase font-light">Escondido, California</div>
            <div class="text-white/60 text-[10px] sm:text-xs tracking-[0.4em] uppercase font-light">December 11, 2026</div>
          </div>
          <div class="hidden md:flex hero-text-intro hero-text-intro-delay items-center gap-3 w-40 sm:w-60">
            <div class="h-px bg-white/30 flex-1"></div>
            <div class="w-1.5 h-1.5 rotate-45 border border-white/30"></div>
            <div class="h-px bg-white/30 flex-1"></div>
          </div>
          ${enterBtn}
        </div>
      </div>`;

  } else if (style === 'b') {
    // Formal Invitation — near-black bg, inset border frame, pure typography
    hero.style.background = '#0d0b09';
    hero.innerHTML = `
      <div class="absolute inset-5 sm:inset-8 border border-white/10 pointer-events-none z-0"></div>
      <div class="relative z-10 text-center flex flex-col items-center justify-center gap-6 px-8">
        <div class="hero-text-intro text-white/25 text-[8px] tracking-[0.65em] uppercase font-light">Save the Date</div>
        <div id="heroTitle" class="font-[Reenie_Beanie] text-7xl sm:text-9xl text-white hero-text-intro whitespace-nowrap leading-none"><span class="hero-keep">J</span><span class="hero-fade">ared</span> <span class="hero-keep">&amp;</span> <span class="hero-keep">M</span><span class="hero-fade">ackensie</span></div>
        <div class="hero-text-intro hero-text-intro-delay w-20 h-px bg-white/15"></div>
        <div id="heroSubtitle" class="hero-text-intro hero-text-intro-delay flex flex-col items-center gap-2">
          <div class="text-white/35 text-[9px] tracking-[0.5em] uppercase font-light">December 11, 2026</div>
          <div class="text-white/35 text-[9px] tracking-[0.5em] uppercase font-light">Escondido, California</div>
        </div>
        ${enterBtn}
      </div>`;

  } else if (style === 'c') {
    // Editorial Split — photo left (or top on mobile), text right (or bottom)
    hero.style.background = '#0a0806';
    hero.innerHTML = `
      <div class="flex flex-col md:flex-row w-full h-full">
        <div class="relative w-full md:w-[55%] h-[45vh] md:h-full overflow-hidden">
          <img src="assets/home-image.jpg" class="w-full h-full object-cover"
            style="filter: grayscale(100%) brightness(0.6) contrast(1.1); object-position: center 20%;" alt="">
          <div class="absolute inset-0 md:hidden" style="background: linear-gradient(to bottom, transparent 50%, #0a0806 100%)"></div>
          <div class="absolute inset-0 hidden md:block" style="background: linear-gradient(to right, transparent 60%, #0a0806 100%)"></div>
        </div>
        <div class="w-full md:w-[45%] flex flex-col items-center justify-center px-10 py-6 md:py-0">
          <div class="text-center">
            <div id="heroTitle" class="font-[Reenie_Beanie] text-6xl sm:text-7xl md:text-8xl text-white hero-text-intro whitespace-nowrap leading-none"><span class="hero-keep">J</span><span class="hero-fade">ared</span> <span class="hero-keep">&amp;</span> <span class="hero-keep">M</span><span class="hero-fade">ackensie</span></div>
            <div class="hero-text-intro hero-text-intro-delay mt-5 w-12 h-px bg-white/20 mx-auto"></div>
            <div id="heroSubtitle" class="hero-text-intro hero-text-intro-delay mt-4 flex flex-col items-center gap-2">
              <div class="text-white/45 text-[9px] sm:text-[10px] tracking-[0.45em] uppercase font-light">December 11, 2026</div>
              <div class="text-white/45 text-[9px] sm:text-[10px] tracking-[0.45em] uppercase font-light">Escondido, California</div>
            </div>
            ${enterBtn}
          </div>
        </div>
      </div>`;
  }
})();
/////////// END HERO STYLE BUILDER ///////////

/////////// ROUTING LOGIC ///////////
const heroSection = document.getElementById('hero');
const navBar = document.getElementById('navBar');
const navLogo = document.getElementById('navLogo');
const navLogoMobile = document.getElementById('navLogoMobile');

function showHero() {
  if (heroSection) heroSection.classList.remove('hidden');
}

function hideHero() {
  if (heroSection) heroSection.classList.add('hidden');
}

function showNav() {
  navBar.classList.remove('opacity-0', 'pointer-events-none');
}

function hideNav() {
  navBar.classList.add('opacity-0', 'pointer-events-none');
}

function showNavLogo() {
  if (navLogo) navLogo.style.opacity = '1';
  if (navLogoMobile) navLogoMobile.style.opacity = '1';
}

function hideNavLogo() {
  if (navLogo) navLogo.style.opacity = '0';
  if (navLogoMobile) navLogoMobile.style.opacity = '0';
}

function navigateToPage(pageName) {
  // Hide all page sections
  const allSections = document.querySelectorAll('.page-section');
  allSections.forEach(section => {
    section.classList.add('hidden');
  });

  // Show the requested page
  const targetSection = document.querySelector(`[data-page="${pageName}"]`);
  if (targetSection) {
    targetSection.classList.remove('hidden');
  }

  if (pageName === 'home') {
    window.scrollTo(0, 0);
  } else {
    showNav();
    showNavLogo();
    window.scrollTo(0, 0);
  }

  // Update active nav link
  const allLinks = document.querySelectorAll('.nav-link');
  allLinks.forEach(link => {
    link.classList.remove('text-white', 'font-bold');
  });
  const activeLink = document.querySelector(`a[href="#/${pageName}"]`);
  if (activeLink) {
    activeLink.classList.add('text-white', 'font-bold');
  }
}

// Determine if this is a fresh visit (no hash) — the intro experience
const isIntro = !window.location.hash;

function handleRoute() {
  const hash = window.location.hash.slice(2); // Remove '#/' from hash
  const page = hash || 'home';
  navigateToPage(page);
}

// On initial load
window.addEventListener('DOMContentLoaded', () => {
  if (isIntro) {
    // Fresh visit — show hero, hide nav, prevent scroll
    hideNav();
    document.body.style.overflow = 'hidden';
    navigateToPage('home');
  } else if (window.location.hash === '#/home' || window.location.hash === '#/') {
    // Direct link to home — skip hero
    if (heroSection) heroSection.style.display = 'none';
    showNav();
    showNavLogo();
    navigateToPage('home');
  } else {
    // Direct link to another page — no hero
    if (heroSection) heroSection.style.display = 'none';
    showNavLogo();
    handleRoute();
  }
});

// Listen for hash changes
window.addEventListener('hashchange', () => {
  if (heroSection && heroSection.style.display !== 'none') {
    heroSection.style.display = 'none';
    showNav();
    showNavLogo();
    document.body.style.overflow = '';
  }
  handleRoute();
});
/////////// END ROUTING LOGIC ///////////

/////////// SIDE NAV LOGIC ///////////
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeNavBtn = document.getElementById('closeNavBtn');
const sideNav = document.getElementById('sideNav');
const sideNavOverlay = document.getElementById('sideNavOverlay');

function openSideNav() {
  sideNav.classList.remove('translate-x-full');
  sideNav.classList.add('translate-x-0');
  sideNavOverlay.classList.remove('opacity-0', 'pointer-events-none');
  sideNavOverlay.classList.add('opacity-100');
}

function closeSideNav() {
  sideNav.classList.remove('translate-x-0');
  sideNav.classList.add('translate-x-full');
  sideNavOverlay.classList.remove('opacity-100');
  sideNavOverlay.classList.add('opacity-0', 'pointer-events-none');
}

hamburgerBtn.addEventListener('click', openSideNav);
closeNavBtn.addEventListener('click', closeSideNav);
sideNavOverlay.addEventListener('click', closeSideNav);

// Close side nav when a link is clicked
sideNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeSideNav);
});
/////////// END SIDE NAV LOGIC ///////////

/////////// HERO ENTER BUTTON LOGIC ///////////
const heroEnterBtn = document.getElementById('heroEnterBtn');

function dismissHero() {
  if (!heroSection) return;

  // Fade out subtitle, decorative rules, and enter button
  heroSection.querySelectorAll('.hero-text-intro-delay, .hero-enter-btn').forEach(el => {
    el.style.transition = 'opacity 0.3s ease';
    el.style.opacity = '0';
  });
  // Fade out the top decorative rule (first .hero-text-intro child)
  const topRule = heroSection.querySelector('.hero-text-intro');
  if (topRule) {
    topRule.style.transition = 'opacity 0.3s ease';
    topRule.style.opacity = '0';
  }

  // Collapse the "ared" and "ackensie" spans
  document.querySelectorAll('.hero-fade').forEach(span => {
    span.style.maxWidth = span.offsetWidth + 'px';
    void span.offsetWidth; // force reflow
    span.style.transition = 'max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease';
    span.style.maxWidth = '0';
    span.style.opacity = '0';
  });

  // After collapse, fly "J & M" from hero to nav logo
  setTimeout(() => {
    const heroTitleEl = document.getElementById('heroTitle');
    if (!heroTitleEl) return;

    const isMobile = window.innerWidth < 768;
    const targetLogo = isMobile ? navLogoMobile : navLogo;
    if (!targetLogo) return;

    const fromRect = heroTitleEl.getBoundingClientRect();
    const toRect = targetLogo.getBoundingClientRect();
    const fromFontSize = parseFloat(window.getComputedStyle(heroTitleEl).fontSize);
    const toFontSize = parseFloat(window.getComputedStyle(targetLogo).fontSize);

    // Create the floating "J & M" element
    const floater = document.createElement('div');
    floater.textContent = 'J & M';
    floater.style.position = 'fixed';
    floater.style.left = (fromRect.left + fromRect.width / 2) + 'px';
    floater.style.top = (fromRect.top + fromRect.height / 2) + 'px';
    floater.style.transform = 'translate(-50%, -50%)';
    floater.style.fontSize = fromFontSize + 'px';
    floater.style.fontFamily = "'Reenie Beanie', cursive";
    floater.style.color = 'white';
    floater.style.whiteSpace = 'nowrap';
    floater.style.pointerEvents = 'none';
    floater.style.zIndex = '500';
    document.body.appendChild(floater);

    // Hide original title
    heroTitleEl.style.opacity = '0';

    // Show nav bar (logo stays hidden — floater takes its place)
    showNav();

    // Animate floater to nav logo position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ease = 'cubic-bezier(0.76, 0, 0.24, 1)';
        floater.style.transition = `left 0.7s ${ease}, top 0.7s ${ease}, font-size 0.7s ${ease}`;
        floater.style.left = (toRect.left + toRect.width / 2) + 'px';
        floater.style.top = (toRect.top + toRect.height / 2) + 'px';
        floater.style.fontSize = toFontSize + 'px';

        // Fade hero out during the fly
        heroSection.style.transition = 'opacity 0.5s ease 0.15s';
        heroSection.style.opacity = '0';
      });
    });

    // After fly: show nav logo, fade out floater, clean up
    setTimeout(() => {
      showNavLogo();
      floater.style.transition = 'opacity 0.25s ease';
      floater.style.opacity = '0';
      setTimeout(() => {
        floater.remove();
        heroSection.style.display = 'none';
        heroSection.style.opacity = '';
        heroSection.style.transition = '';
        document.body.style.overflow = '';
      }, 250);
    }, 750);
  }, 550);
}

if (heroEnterBtn) {
  heroEnterBtn.addEventListener('click', dismissHero);
}
/////////// END HERO ENTER BUTTON LOGIC ///////////

/////////// COUNTDOWN TIMER LOGIC ///////////
let dest = new Date("dec 11, 2026 10:00:00").getTime();

// Store previous digit values to detect changes
let previousDigits = {};

function updateDigit(digitElement, newValue) {
  const spans = digitElement.querySelectorAll('.digit-value');
  const currentValue = spans[0].textContent;
  
  if (currentValue !== newValue) {
    // Update both top and bottom with new value
    spans.forEach(span => {
      span.textContent = newValue;
    });
    
    // Trigger flip animation
    digitElement.classList.add('flipping');
    
    // Remove flipping class after animation
    setTimeout(() => {
      digitElement.classList.remove('flipping');
    }, 500);
  } else if (currentValue === '') {
    // Initial load
    spans.forEach(span => {
      span.textContent = newValue;
    });
  }
}

function updateCountdown() {
  let now = new Date().getTime();
  let diff = dest - now;

  if (diff <= 0) {
    clearInterval(countdownInterval);
    return;
  }

  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Pad with zeros
  let daysStr = String(days).padStart(2, '0');
  let hoursStr = String(hours).padStart(2, '0');
  let minutesStr = String(minutes).padStart(2, '0');
  let secondsStr = String(seconds).padStart(2, '0');

  // Update days
  const daysTens = document.querySelector('.flip-digit[data-unit="days"][data-position="tens"]');
  const daysOnes = document.querySelector('.flip-digit[data-unit="days"][data-position="ones"]');
  if (daysTens && daysOnes) {
    updateDigit(daysTens, daysStr[0]);
    updateDigit(daysOnes, daysStr[1]);
  }

  // Update hours
  const hoursTens = document.querySelector('.flip-digit[data-unit="hours"][data-position="tens"]');
  const hoursOnes = document.querySelector('.flip-digit[data-unit="hours"][data-position="ones"]');
  if (hoursTens && hoursOnes) {
    updateDigit(hoursTens, hoursStr[0]);
    updateDigit(hoursOnes, hoursStr[1]);
  }

  // Update minutes
  const minutesTens = document.querySelector('.flip-digit[data-unit="minutes"][data-position="tens"]');
  const minutesOnes = document.querySelector('.flip-digit[data-unit="minutes"][data-position="ones"]');
  if (minutesTens && minutesOnes) {
    updateDigit(minutesTens, minutesStr[0]);
    updateDigit(minutesOnes, minutesStr[1]);
  }

  // Update seconds
  const secondsTens = document.querySelector('.flip-digit[data-unit="seconds"][data-position="tens"]');
  const secondsOnes = document.querySelector('.flip-digit[data-unit="seconds"][data-position="ones"]');
  if (secondsTens && secondsOnes) {
    updateDigit(secondsTens, secondsStr[0]);
    updateDigit(secondsOnes, secondsStr[1]);
  }
}

// Initial update
updateCountdown();

// Update every second
let countdownInterval = setInterval(updateCountdown, 1000);
/////////// END COUNTDOWN TIMER LOGIC ///////////

/////////// LIGHTBOX LOGIC ///////////
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const galleryImages = document.querySelectorAll('#gallery img');
let currentIndex = 0;
let storyPhotoOpen = false;

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = galleryImages[currentIndex].src;
  lightbox.classList.remove('opacity-0', 'pointer-events-none');
  lightbox.classList.add('opacity-100');
}

function closeLightbox() {
  lightbox.classList.remove('opacity-100');
  lightbox.classList.add('opacity-0', 'pointer-events-none');
  if (storyPhotoOpen) {
    storyPhotoOpen = false;
    lightboxPrev.classList.remove('hidden');
    lightboxNext.classList.remove('hidden');
  }
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
}

galleryImages.forEach((img, i) => {
  img.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('opacity-0')) return;
  if (e.key === 'Escape') closeLightbox();
  if (storyPhotoOpen) return;
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});
/////////// END LIGHTBOX LOGIC ///////////

/////////// STORY PHOTO MODAL ///////////
document.querySelectorAll('.story-photo').forEach((img) => {
  img.addEventListener('click', () => {
    storyPhotoOpen = true;
    lightboxImg.src = img.src;
    lightboxPrev.classList.add('hidden');
    lightboxNext.classList.add('hidden');
    lightbox.classList.remove('opacity-0', 'pointer-events-none');
    lightbox.classList.add('opacity-100');
  });
});