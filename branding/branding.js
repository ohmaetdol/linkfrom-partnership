'use strict';

const stage = document.querySelector('.people-stage');
const videos = [...document.querySelectorAll('[data-person-video]')];
const tabs = [...document.querySelectorAll('[data-select-person]')];
const toggle = document.getElementById('carousel-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const people = [
  { name: '사장찍어주는남자', role: '직접 운영 채널', audience: '유튜브 14만' },
  { name: '오은환의하이라이트', role: '함께한 채널', audience: '유튜브 14만' },
  { name: '홍아린 AI', role: '함께한 채널', audience: '유튜브 약 8만' },
  { name: '다음은, 당신의 채널입니다.', role: '새로운 주인공을 기다립니다', audience: 'NEXT CREATOR' },
  { name: '당신의 이야기를 기다립니다.', role: '새로운 주인공을 기다립니다', audience: 'NEXT CREATOR' }
];
let active = 0;
let paused = reducedMotion.matches;
let visible = true;
let playAttempt = 0;

function updateControls() {
  toggle.textContent = paused ? '영상 재생 ▷' : '영상 멈춤 Ⅱ';
  toggle.setAttribute('aria-label', paused ? '인물 영상 재생' : '인물 영상 일시정지');
  stage.dataset.paused = String(paused);
}

function syncPlayback() {
  const attempt = ++playAttempt;
  videos.forEach((video, index) => { if (index !== active) video.pause(); });
  updateControls();
  const video = videos[active];
  if (paused || !visible || document.hidden) {
    video.pause();
    return;
  }
  if (video.ended) video.currentTime = 0;
  video.play().catch(error => {
    // A switch or pause can cancel an in-flight play request normally.
    if (attempt !== playAttempt || error.name === 'AbortError') return;
    paused = true;
    updateControls();
  });
}

function selectPerson(index) {
  active = index;
  videos.forEach((video, i) => {
    video.dataset.active = String(i === index);
    video.setAttribute('aria-hidden', String(i !== index));
    if (i === index) video.currentTime = 0;
  });
  tabs.forEach((tab, i) => tab.setAttribute('aria-pressed', String(i === index)));
  document.getElementById('person-name').textContent = people[index].name;
  document.getElementById('person-role').textContent = people[index].role;
  document.getElementById('person-headline-name').textContent = people[index].name;
  document.getElementById('person-audience').textContent = people[index].audience;
  document.getElementById('person-index').textContent = String(index + 1).padStart(2, '0');
  stage.style.setProperty('--film-progress', '0%');
  syncPlayback();
}

videos.forEach((video, index) => {
  video.muted = true;
  video.playbackRate = 1.2;
  video.addEventListener('ended', () => {
    if (index === active && !paused && visible && !document.hidden) {
      selectPerson((active + 1) % people.length);
    }
  });
  video.addEventListener('timeupdate', () => {
    if (index === active && Number.isFinite(video.duration) && video.duration > 0) {
      stage.style.setProperty('--film-progress', `${video.currentTime / video.duration * 100}%`);
    }
  });
  video.addEventListener('error', () => {
    if (index === active) { paused = true; updateControls(); }
  });
});

tabs.forEach(tab => tab.addEventListener('click', () => selectPerson(Number(tab.dataset.selectPerson))));
toggle.addEventListener('click', () => { paused = !paused; syncPlayback(); });
reducedMotion.addEventListener('change', event => { paused = event.matches; syncPlayback(); });
document.addEventListener('visibilitychange', syncPlayback);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncPlayback();
  }, { threshold: 0.15 }).observe(stage);
}
document.getElementById('person-total').textContent = String(people.length).padStart(2, '0');
syncPlayback();

// Click-to-play keeps real portfolio videos visible without loading every player at once.
document.querySelectorAll('[data-youtube]').forEach(container => {
  container.querySelector('button').addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${container.dataset.youtube}?autoplay=1&playsinline=1&rel=0`;
    frame.title = container.dataset.videoTitle;
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    container.replaceChildren(frame);
  });
});
