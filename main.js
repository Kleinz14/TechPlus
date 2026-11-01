const content = [
  {
    eyebrow: 'COMPUTER TRAINING FOR A BRIGHTER TOMORROW',
    title1: 'Learn Technology.',
    title2: 'Build Your Future.',
    sub: 'Professional computer training for students and professionals.'
  },
  {
    eyebrow: 'WEB DEVELOPMENT',
    title1: 'Code Real Projects.',
    title2: 'Launch Real Websites.',
    sub: 'HTML, CSS, JavaScript and React taught hands-on by expert trainers.'
  },
  {
    eyebrow: 'CAREER SUPPORT',
    title1: 'From Learner',
    title2: 'To Employed.',
    sub: 'Certified trainers, modern labs and job placement guidance.'
  }
];

const track = document.querySelector('.hero-track');
const slides = document.querySelectorAll('.hero-slide');
const dotsBox = document.querySelector('.hero-dots');
const text = document.querySelector('.hero-text');

// the last slide is only a copy of the first, so it gets no dot
const realCount = slides.length - 1;

let current = 0;
let timer;

for (let n = 0; n < realCount; n++) {
  const dot = document.createElement('button');
  dot.addEventListener('click', function () {
    show(n);
  });
  dotsBox.appendChild(dot);
}

// zoom only the slide that is showing
function setActive(k) {
  slides.forEach(function (s, i) {
    s.classList.toggle('active', i === k);
  });
}

function show(n) {
  if (n < 0) n = realCount - 1;
  current = n;

  // slide sideways
  track.style.transition = 'transform 0.8s ease';
  track.style.transform = 'translateX(-' + current * 100 + '%)';
  setActive(current);

  // on the copy slide, jump back to the real first slide after sliding
  if (current === realCount) {
    setTimeout(function () {
      if (current === realCount) {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        current = 0;
        setActive(0);
      }
    }, 800);
  }

  const index = current % realCount;

  // dots
  Array.from(dotsBox.children).forEach(function (d, k) {
    d.classList.toggle('on', k === index);
  });

  // words for this slide
  document.getElementById('eyebrow').textContent = content[index].eyebrow;
  document.getElementById('title1').textContent = content[index].title1;
  document.getElementById('title2').textContent = content[index].title2;
  document.getElementById('sub').textContent = content[index].sub;

  // replay the text animation
  text.classList.remove('animate');
  void text.offsetWidth;
  text.classList.add('animate');

  // restart the 5 second timer
  clearInterval(timer);
  timer = setInterval(function () {
    show(current + 1);
  }, 5000);
}

show(0);

const photos = document.querySelectorAll('.g');
const photoDots = document.querySelector('.gallery-dots');
let photoIndex = 0;
let photoTimer;

photos.forEach(function (p, n) {
  const dot = document.createElement('button');
  dot.addEventListener('click', function () { showPhoto(n); });
  photoDots.appendChild(dot);
});

function showPhoto(n) {
  photoIndex = (n + photos.length) % photos.length;
  photos.forEach(function (p, k) { p.classList.toggle('on', k === photoIndex); });
  Array.from(photoDots.children).forEach(function (d, k) { d.classList.toggle('on', k === photoIndex); });
  clearInterval(photoTimer);
  photoTimer = setInterval(function () { showPhoto(photoIndex + 1); }, 4000);
}

showPhoto(0);

// ---------- counting numbers ----------
const counters = document.querySelectorAll('.count');
const statsSection = document.querySelector('.stats');

// start at 0 so the count is visible
counters.forEach(function (el) {
  el.textContent = '0' + (el.dataset.suffix || '');
});

function runCount(el) {
  const target = Number(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(target * progress);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

const observer = new IntersectionObserver(function (entries) {
  if (entries[0].isIntersecting) {
    counters.forEach(runCount);
    observer.disconnect();
  }
}, { threshold: 0.2 });

observer.observe(statsSection);

// ---------- testimonials slider ----------
const reviews = document.querySelectorAll('.review');
let reviewIndex = 0;
let reviewTimer;

function showReview(n) {
  reviewIndex = (n + reviews.length) % reviews.length;

  reviews.forEach(function (r, k) {
    r.classList.toggle('on', k === reviewIndex);
  });

  clearInterval(reviewTimer);
  reviewTimer = setInterval(function () {
    showReview(reviewIndex + 1);
  }, 6000);
}

document.getElementById('prevReview').addEventListener('click', function () {
  showReview(reviewIndex - 1);
});

document.getElementById('nextReview').addEventListener('click', function () {
  showReview(reviewIndex + 1);
});

showReview(0);

