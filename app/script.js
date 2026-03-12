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
let dest = new Date("2026-12-11T15:30:00-08:00").getTime();

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
  let daysStr = String(days).padStart(3, '0');
  let hoursStr = String(hours).padStart(2, '0');
  let minutesStr = String(minutes).padStart(2, '0');
  let secondsStr = String(seconds).padStart(2, '0');

  // Update days
  const daysHundreds = document.querySelector('.flip-digit[data-unit="days"][data-position="hundreds"]');
  const daysTens = document.querySelector('.flip-digit[data-unit="days"][data-position="tens"]');
  const daysOnes = document.querySelector('.flip-digit[data-unit="days"][data-position="ones"]');
  if (days < 100 && daysHundreds) {
    daysHundreds.parentElement.remove()
  }

  if (days >= 100 && daysHundreds) {
    updateDigit(daysHundreds, daysStr[0]);
  }

  if (daysTens && daysOnes) {
    updateDigit(daysHundreds, daysStr[0]);
    updateDigit(daysTens, daysStr[1]);
    updateDigit(daysOnes, daysStr[2]);
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
  const thumb = galleryImages[currentIndex];
  lightboxImg.src = thumb.dataset.large || thumb.src;
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
  const thumb = galleryImages[currentIndex];
  lightboxImg.src = thumb.dataset.large || thumb.src;
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  const thumb = galleryImages[currentIndex];
  lightboxImg.src = thumb.dataset.large || thumb.src;
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