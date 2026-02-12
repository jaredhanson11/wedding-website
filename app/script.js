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

  // Hero is only visible on the home page
  if (pageName === 'home') {
    showHero();
    window.scrollTo(0, 0);
  } else {
    hideHero();
    showNav();
    showNavLogo();
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
    // Fresh domain.com visit — nav is fully hidden until animation completes
    hideNav();
    navigateToPage('home');
  } else if (window.location.hash === '#/home' || window.location.hash === '#/') {
    // Reload on #/home — skip to main content, no hero
    if (heroSection) {
      heroSection.classList.add('no-animate');
      heroSection.style.display = 'none';
      introCompleted = true;
    }
    showNav();
    showNavLogo();
    navigateToPage('home');
  } else {
    // Reload on #/anything-else — no hero at all
    if (heroSection) heroSection.classList.add('no-animate');
    showNavLogo();
    handleRoute();
  }
});

// Listen for hash changes
window.addEventListener('hashchange', () => {
  // After intro, all subsequent hero views skip animation
  if (heroSection) {
    heroSection.classList.add('no-animate');
    introCompleted = true; // Mark intro as completed so animation won't trigger
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

/////////// HERO SCROLL & NAV VISIBILITY ///////////
const heroSubtitle = document.getElementById('heroSubtitle');
const heroTitle = document.getElementById('heroTitle');
const floatingTitle = document.getElementById('floatingTitle');
const navLogo = document.getElementById('navLogo');
const navLogoMobile = document.getElementById('navLogoMobile');
const heroFadeSpans = document.querySelectorAll('.hero-fade');

// Track if intro animation has completed or is playing
let introCompleted = false;
let animationPlaying = false;
let animationProgress = 0;

// Measure natural widths of the fading spans on load
let fadeSpanWidths = [];
if (heroSection) {
  heroFadeSpans.forEach(span => {
    fadeSpanWidths.push(span.offsetWidth);
  });
}

// Function to apply visual effects based on progress (0 to 1)
function applyHeroAnimationEffects(progress) {
  const endSize = 3.75; // rem (text-6xl, matches nav)
  const startSize = window.innerWidth >= 768 ? 8 : window.innerWidth >= 640 ? 4.5 : 3; // rem (text-9xl md / text-7xl sm / text-5xl base)

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
    if (progress <= shrinkStart) {
      heroTitle.style.fontSize = '';
    } else if (progress >= shrinkEnd) {
      heroTitle.style.fontSize = endSize + 'rem';
    } else {
      const t = (progress - shrinkStart) / (shrinkEnd - shrinkStart);
      const size = startSize - (startSize - endSize) * t;
      heroTitle.style.fontSize = size + 'rem';
    }

    // --- Phase 4 (50–85%): Float "J & M" up into the actual nav logo position ---
    const floatStart = 0.5;
    const floatEnd = 0.85;

    // Get the real nav logo's position as our target
    const targetLogo = window.innerWidth >= 768 ? navLogo : navLogoMobile;

    if (progress < floatStart) {
      // Hero title visible, floating hidden, entire nav hidden
      heroTitle.style.visibility = 'visible';
      floatingTitle.style.opacity = 0;
      hideNav();
    } else if (progress >= floatEnd) {
      // Handoff complete: hide floating, reveal entire nav bar
      heroTitle.style.visibility = 'hidden';
      floatingTitle.style.opacity = 0;
      showNav();
      showNavLogo();

      // Mark intro as completed and transition to main content
      if (!introCompleted) {
        introCompleted = true;
        setTimeout(() => {
          heroSection.style.display = 'none';
          window.scrollTo(0, 0);
          document.body.style.overflow = '';
        }, 100);
      }
    } else {
      // Hide hero title, show floating and move it toward nav logo
      heroTitle.style.visibility = 'hidden';
      floatingTitle.style.opacity = 1;
      hideNav();

      const t = (progress - floatStart) / (floatEnd - floatStart);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic

      // Start: center of hero title on screen
      const heroRect = heroTitle.getBoundingClientRect();
      const startTop = heroRect.top + heroRect.height / 2;
      const startLeft = window.innerWidth / 2;

      // End: center of the actual nav logo element
      const logoRect = targetLogo.getBoundingClientRect();
      const endTop = logoRect.top + logoRect.height / 2;
      const endLeft = logoRect.left + logoRect.width / 2;

      const currentTop = startTop + (endTop - startTop) * ease;
      const currentLeft = startLeft + (endLeft - startLeft) * ease;
      const fontSize = endSize + (endSize * 0.1 * (1 - ease));

      floatingTitle.style.position = 'fixed';
      floatingTitle.style.top = currentTop + 'px';
      floatingTitle.style.left = currentLeft + 'px';
      floatingTitle.style.transform = 'translate(-50%, -50%)';
      floatingTitle.style.fontSize = fontSize + 'rem';
      floatingTitle.style.lineHeight = '1';
    }
}

// Controlled animation function
function startHeroAnimation() {
  if (animationPlaying || introCompleted) return;
  
  animationPlaying = true;
  document.body.style.overflow = 'hidden'; // Disable scrolling during animation
  window.scrollTo(0, 0); // Reset scroll position
  
  const duration = 3000; // 3 seconds for the full animation
  const startTime = performance.now();
  
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    animationProgress = Math.min(elapsed / duration, 1);
    
    applyHeroAnimationEffects(animationProgress);
    
    if (animationProgress < 1) {
      requestAnimationFrame(animate);
    } else {
      animationPlaying = false;
    }
  }
  
  requestAnimationFrame(animate);
}

if (heroSection) {
  // Listen for any scroll or touch to trigger the animation (only on fresh visits)
  let scrollTriggered = false;
  
  const triggerAnimation = (e) => {
    // Only trigger animation if this is a fresh visit (isIntro)
    if (isIntro && !scrollTriggered && !heroSection.classList.contains('hidden') && !introCompleted) {
      scrollTriggered = true;
      e.preventDefault();
      startHeroAnimation();
    }
  };
  
  // Intercept scroll events only on fresh visits
  if (isIntro) {
    window.addEventListener('wheel', triggerAnimation, { passive: false });
    window.addEventListener('touchstart', triggerAnimation, { passive: false });
    window.addEventListener('keydown', (e) => {
      // Trigger on arrow keys, space, page down
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) {
        triggerAnimation(e);
      }
    });
  }

  // Intersection Observer — safety net
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (heroSection.classList.contains('hidden')) return;
        if (!entry.isIntersecting) {
          showNav();
          showNavLogo();
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