'use strict';
const form = document.getElementById('brief-form');
const result = document.getElementById('brief-result');
const output = document.getElementById('brief-text');
const status = document.getElementById('copy-status');
form.addEventListener('submit', event => {
  event.preventDefault();
  const company = form.elements.company.value.trim();
  const product = form.elements.product.value.trim();
  if (!company || !product) {
    const missing = !company ? form.elements.company : form.elements.product;
    missing.setCustomValidity('내용을 입력해 주세요.');
    missing.reportValidity();
    return;
  }
  const budget = form.elements.budget.value.trim();
  output.value = [
    '안녕하세요. 링크프롬 파트너사 캠페인에 관심이 있습니다.',
    '',
    `업체명: ${company}`,
    `상품·서비스 링크: ${product}`,
    `캠페인 목표: ${form.elements.goal.value}`,
    `희망 예산·일정: ${budget || '협의 희망'}`,
    '',
    '우리 상품에 맞는 채널과 진행 방식, 채널 집행비 및 성과 수수료 조건을 안내받고 싶습니다.'
  ].join('\n');
  result.hidden = false;
  status.textContent = '아직 전송되지 않았습니다. 문구를 복사해 제안받으신 메시지로 보내주세요.';
  output.focus();
});
for (const field of [form.elements.company, form.elements.product]) {
  field.addEventListener('input', () => field.setCustomValidity(''));
}
document.getElementById('copy-brief').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    status.textContent = '복사했습니다. 제안받으신 메시지에 붙여넣어 보내주세요.';
  } catch {
    output.focus();
    output.select();
    status.textContent = '문구를 선택했습니다. 직접 복사해 제안받으신 메시지로 보내주세요.';
  }
});
