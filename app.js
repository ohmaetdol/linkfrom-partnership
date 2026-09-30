'use strict';
const slider = document.getElementById('views');
const viewsValue = document.getElementById('views-value');
const bonusValue = document.getElementById('bonus-value');
const explainer = document.getElementById('bonus-explainer');
const presets = [...document.querySelectorAll('[data-views]')];
const number = new Intl.NumberFormat('ko-KR');
function updateBonus() {
  const views = Math.max(0, Number(slider.value));
  const blocks = Math.floor(views / 10000);
  const bonus = Math.min(blocks * 50000, 500000);
  viewsValue.textContent = number.format(views);
  bonusValue.textContent = number.format(bonus);
  slider.style.setProperty('--fill', `${views / Number(slider.max) * 100}%`);
  slider.setAttribute('aria-valuetext', `${number.format(views)}회, 보너스 ${number.format(bonus)}원`);
  explainer.textContent = views < 10000 ? '1만 회부터 보너스가 시작됩니다.' : views >= 100000 ? '영상당 최대 보너스 50만 원이 적용됩니다.' : `1만 회 × ${blocks}구간 · 구간당 5만 원`;
  for (const button of presets) {
    const selected = Number(button.dataset.views) === views;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
}
slider.addEventListener('input', updateBonus);
presets.forEach(button => button.addEventListener('click', () => {slider.value = button.dataset.views; updateBonus();}));
updateBonus();

const reply = '안녕하세요. 링크프롬 채널 협업에 관심이 있습니다.\n\n제 채널 링크: \n\n제 채널에 맞는 협업 방식과 보상 조건을 안내받고 싶습니다.';
const dialog = document.getElementById('reply-dialog');
document.getElementById('reply-text').value = reply;
document.getElementById('copy-reply').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard) throw new Error('Clipboard not available');
    await navigator.clipboard.writeText(reply);
    document.getElementById('copy-status').textContent = '복사했습니다. 내용을 채워 제안받으신 메시지로 보내주세요.';
  } catch {
    dialog.showModal();
    const text = document.getElementById('reply-text'); text.focus(); text.select();
    document.getElementById('copy-status').textContent = '회신 문구를 직접 복사할 수 있도록 열었습니다.';
  }
});
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {if (event.target === dialog) {const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});

const marqueeToggle = document.getElementById('marquee-toggle');
if (marqueeToggle) {
  marqueeToggle.addEventListener('click', () => {
    const paused = document.querySelector('.partner-marquee').classList.toggle('is-paused');
    marqueeToggle.setAttribute('aria-pressed', String(paused));
    marqueeToggle.textContent = paused ? '움직임 재생하기' : '움직임 멈추기';
  });
}
