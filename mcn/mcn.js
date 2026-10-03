(() => {
  const menu = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', '메뉴 열기'); mobileNav.hidden = true; };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기'); mobileNav.hidden = !open; });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menu.focus(); } });

  const videos = [...document.querySelectorAll('.portrait-video')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('#motion-toggle');
  const visible = new Set();
  let paused = reduced.matches;
  const labelMotion = () => { motionButton.setAttribute('aria-pressed', String(paused)); motionButton.innerHTML = paused ? '인물 영상 재생 <span aria-hidden="true">▶</span>' : '인물 영상 멈춤 <span aria-hidden="true">Ⅱ</span>'; };
  const sync = () => {
    videos.forEach(video => {
      if (!paused && !document.hidden && visible.has(video)) {
        video.muted = true;
        if (video.readyState === 0) { video.preload = 'auto'; video.load(); }
        video.play().catch(() => {});
      } else video.pause();
    });
  };
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); }); sync(); }, { threshold: .15 });
  videos.forEach(v => observer.observe(v));
  motionButton.addEventListener('click', () => { paused = !paused; labelMotion(); sync(); });
  reduced.addEventListener('change', e => { paused = e.matches; labelMotion(); sync(); });
  document.addEventListener('visibilitychange', sync);
  labelMotion();

  const copyButton = document.querySelector('#copy-intro');
  copyButton.addEventListener('click', async () => {
    const text = document.querySelector('#intro-text').textContent;
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = '복사했어요. 내용을 채운 뒤 담당자에게 보내주세요.';
    } catch {
      document.querySelector('.intro-preview').open = true;
      const selection = getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('#intro-text'));
      selection.removeAllRanges(); selection.addRange(range);
      status.textContent = '아래 선택된 내용을 복사해 담당자에게 보내주세요.';
    }
  });
})();
