/////////// ROUTING LOGIC ///////////
const heroSection = document.getElementById('hero');
const navBar = document.getElementById('navBar');

function showHero() {
  if (heroSection) heroSection.classList.remove('hidden');
}

function hideHero() {
  if (heroSection) heroSection.classList.add('hidden');
}

function showNav() {
  navBar.classList.remove('-translate-y-full', 'opacity-0');
}

function hideNav() {
  navBar.classList.add('-translate-y-full', 'opacity-0');
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

  // Hero is only visible on the home page
  if (pageName === 'home') {
    showHero();
    window.scrollTo(0, 0);
  } else {
    hideHero();
    showNav();
    window.scrollTo(0, 0);
  }

  // Update active nav link
  const allLinks = document.querySelectorAll('.nav-link');
  allLinks.forEach(link => {
    link.classList.remove('text-[#d4a574]', 'font-bold');
  });
  const activeLink = document.querySelector(`a[href="#/${pageName}"]`);
  if (activeLink) {
    activeLink.classList.add('text-[#d4a574]', 'font-bold');
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
    // Fresh domain.com visit — play hero animations, hero is visible
    navigateToPage('home');
  } else if (window.location.hash === '#/home' || window.location.hash === '#/') {
    // Reload on #/home — show hero but skip animations
    if (heroSection) heroSection.classList.add('no-animate');
    navigateToPage('home');
  } else {
    // Reload on #/anything-else — no hero at all
    if (heroSection) heroSection.classList.add('no-animate');
    handleRoute();
  }
});

// Listen for hash changes
window.addEventListener('hashchange', () => {
  // After intro, all subsequent hero views skip animation
  if (heroSection) heroSection.classList.add('no-animate');
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

/////////// HERO SCROLL & NAV VISIBILITY ///////////
const heroSubtitle = document.getElementById('heroSubtitle');
const heroTitle = document.getElementById('heroTitle');
const floatingTitle = document.getElementById('floatingTitle');
const navLogo = document.getElementById('navLogo');
const navLogoMobile = document.getElementById('navLogoMobile');
const heroFadeSpans = document.querySelectorAll('.hero-fade');

// Measure natural widths of the fading spans on load
let fadeSpanWidths = [];
if (heroSection) {
  heroFadeSpans.forEach(span => {
    fadeSpanWidths.push(span.offsetWidth);
  });
}

if (heroSection) {
  window.addEventListener('scroll', () => {
    if (heroSection.classList.contains('hidden')) return;

    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const progress = Math.min(scrollY / heroHeight, 1);

    // --- Phase 1 (0–15%): Subtitle and flowers fade out ---
    if (heroSubtitle) {
      const subtitleFade = Math.max(1 - progress / 0.15, 0);
      heroSubtitle.style.opacity = subtitleFade;
    }

    // Background (flowers) fade
    const bgFade = Math.max(1 - progress * 2, 0.1);
    heroSection.style.opacity = bgFade;

    // --- Phase 2 (10–30%): "ared" and "ackensie" fade out & collapse width ---
    const fadeStart = 0.1;
    const fadeEnd = 0.3;
    if (progress <= fadeStart) {
      heroFadeSpans.forEach((span, i) => {
        span.style.opacity = 1;
        span.style.width = fadeSpanWidths[i] + 'px';
      });
    } else if (progress >= fadeEnd) {
      heroFadeSpans.forEach(span => {
        span.style.opacity = 0;
        span.style.width = '0px';
      });
    } else {
      const t = (progress - fadeStart) / (fadeEnd - fadeStart);
      heroFadeSpans.forEach((span, i) => {
        span.style.opacity = 1 - t;
        span.style.width = (fadeSpanWidths[i] * (1 - t)) + 'px';
      });
    }

    // --- Phase 3 (30–50%): Shrink font size from hero size to nav size ---
    const shrinkStart = 0.3;
    const shrinkEnd = 0.5;
    // text-9xl = 8rem on md, text-6xl = 3.75rem target
    const startSize = window.innerWidth >= 768 ? 8 : 6; // rem (text-9xl md / text-8xl sm)
    const endSize = 3.75; // rem (text-6xl, matches nav)
    if (progress <= shrinkStart) {
      heroTitle.style.fontSize = '';
    } else if (progress >= shrinkEnd) {
      heroTitle.style.fontSize = endSize + 'rem';
    } else {
      const t = (progress - shrinkStart) / (shrinkEnd - shrinkStart);
      const size = startSize - (startSize - endSize) * t;
      heroTitle.style.fontSize = size + 'rem';
    }

    // --- Phase 4 (50–85%): Switch to floating "J & M" and move to nav ---
    const floatStart = 0.5;
    const floatEnd = 0.85;

    if (progress < floatStart) {
      // Hero title visible, floating hidden
      heroTitle.style.visibility = 'visible';
      floatingTitle.style.opacity = 0;
    } else if (progress >= floatEnd) {
      // Handoff complete: hide everything, show real nav
      heroTitle.style.visibility = 'hidden';
      floatingTitle.style.opacity = 0;
      showNav();
    } else {
      // Hide hero title, show floating and move it
      heroTitle.style.visibility = 'hidden';
      floatingTitle.style.opacity = 1;

      const t = (progress - floatStart) / (floatEnd - floatStart);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic

      // Start: where heroTitle currently is on screen
      const heroRect = heroTitle.getBoundingClientRect();
      const startTop = heroRect.top + heroRect.height / 2;
      const startLeft = window.innerWidth / 2;

      // End: where the nav logo sits (show nav temporarily off-screen to measure)
      const targetEl = window.innerWidth >= 768 ? navLogo : navLogoMobile;
      // The nav is hidden (-translate-y-full), so estimate: logo is ~30px from top, centered or left
      const endTop = window.innerWidth >= 768 ? 28 : 24;
      const endLeft = window.innerWidth >= 768 ? window.innerWidth / 2 : 48;

      const currentTop = startTop + (endTop - startTop) * ease;
      const currentLeft = startLeft + (endLeft - startLeft) * ease;
      const fontSize = endSize + (endSize * 0.1 * (1 - ease)); // slight shrink

      floatingTitle.style.position = 'fixed';
      floatingTitle.style.top = currentTop + 'px';
      floatingTitle.style.left = currentLeft + 'px';
      floatingTitle.style.transform = 'translate(-50%, -50%)';
      floatingTitle.style.fontSize = fontSize + 'rem';
      floatingTitle.style.lineHeight = '1';
    }

    // Hide nav if scrolling back up into hero
    if (progress < floatEnd) {
      hideNav();
    }
  });

  // Intersection Observer — safety net
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (heroSection.classList.contains('hidden')) return;
        if (!entry.isIntersecting) {
          showNav();
          floatingTitle.style.opacity = 0;
        }
      });
    },
    { threshold: 0.05 }
  );

  observer.observe(heroSection);
}
/////////// END HERO SCROLL & NAV VISIBILITY ///////////

/////////// COUNTDOWN TIMER LOGIC ///////////
// count-down timer
let dest = new Date("apr 25, 2026 10:00:00").getTime();
let x = setInterval(function () {
let now = new Date().getTime();
let diff = dest - now;

// Check if the countdown has reached zero or negative
if (diff <= 0) {
  clearInterval(x); // Stop the countdown
  return; // Exit the function
}

let days = Math.floor(diff / (1000 * 60 * 60 * 24));
let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
let seconds = Math.floor((diff % (1000 * 60)) / 1000);

if (days < 10) {
days = `0${days}`;
}
if (hours < 10) {
hours = `0${hours}`;
}
if (minutes < 10) {
minutes = `0${minutes}`;
}
if (seconds < 10) {
seconds = `0${seconds}`;
}

// Get elements by class name
let countdownElements = document.getElementsByClassName("countdown-element");

// Loop through the elements and update their content
for (let i = 0; i < countdownElements.length; i++) {
let className = countdownElements[i].classList[1]; // Get the second class name
switch (className) {
  case "days":
    countdownElements[i].innerHTML = days;
    break;
  case "hours":
    countdownElements[i].innerHTML = hours;
    break;
  case "minutes":
    countdownElements[i].innerHTML = minutes;
    break;
  case "seconds":
    countdownElements[i].innerHTML = seconds;
    break;
  default:
    break;
}
}
}, 1000);
/////////// END COUNTDOWN TIMER LOGIC ///////////

/////////// LIGHTBOX LOGIC ///////////
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const galleryImages = document.querySelectorAll('#gallery img');
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = galleryImages[currentIndex].src;
  lightbox.classList.remove('opacity-0', 'pointer-events-none');
  lightbox.classList.add('opacity-100');
}

function closeLightbox() {
  lightbox.classList.remove('opacity-100');
  lightbox.classList.add('opacity-0', 'pointer-events-none');
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
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});
/////////// END LIGHTBOX LOGIC ///////////