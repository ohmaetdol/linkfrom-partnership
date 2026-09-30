'use strict';
const form = document.getElementById('brief-form');
const result = document.getElementById('brief-result');
const status = document.getElementById('submit-status');
const submitButton = document.getElementById('submit-brief');
const endpoint = form.dataset.endpoint;
let pendingRequest = null;
let submitting = false;

function showStatus(message, state) {
  status.textContent = message;
  status.dataset.state = state;
}

for (const field of [form.elements.company, form.elements.email, form.elements.product]) {
  field.addEventListener('input', () => field.setCustomValidity(''));
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting) return;
  const data = Object.fromEntries(new FormData(form));
  for (const key of Object.keys(data)) data[key] = data[key].trim();
  for (const key of ['company', 'email', 'product']) {
    if (!data[key]) {
      form.elements[key].setCustomValidity('내용을 입력해 주세요.');
      form.elements[key].reportValidity();
      return;
    }
  }
  if (!/^https?:\/\//i.test(data.product)) data.product = 'https://' + data.product;
  try {
    const url = new URL(data.product);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) throw new Error();
    data.product = url.href;
  } catch {
    form.elements.product.setCustomValidity('유효한 홈페이지 또는 상품 링크를 입력해 주세요.');
    form.elements.product.reportValidity();
    return;
  }
  if (!endpoint) {
    showStatus('접수 연결을 준비 중입니다. 잠시 후 다시 방문해 주세요.', 'error');
    return;
  }
  const fingerprint = JSON.stringify(data);
  // A retry after a timeout reuses the ID to avoid duplicate spreadsheet rows.
  if (!pendingRequest || pendingRequest.fingerprint !== fingerprint) {
    pendingRequest = { fingerprint, requestId: 'lf_' + crypto.randomUUID() };
  }
  data.requestId = pendingRequest.requestId;
  submitting = true;
  form.setAttribute('aria-busy', 'true');
  const controls = [...form.elements];
  controls.forEach(control => { control.disabled = true; });
  submitButton.textContent = '접수 중…';
  showStatus('요청을 전달하고 있습니다. 잠시만 기다려 주세요.', 'pending');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST', mode: 'cors', redirect: 'follow', credentials: 'omit',
      headers: {'Content-Type': 'text/plain;charset=UTF-8'},
      body: JSON.stringify(data), signal: controller.signal
    });
    if (!response.ok) throw new Error();
    const saved = await response.json();
    if (!saved.ok) {
      const messages = {
        INVALID: '필수 항목과 상품 링크, 이메일을 다시 확인해 주세요.',
        RATE_LIMIT: '접수 요청이 많습니다. 잠시 후 다시 시도해 주세요.',
        BUSY: '접수가 몰리고 있어요. 잠시 후 다시 제출해 주세요.'
      };
      showStatus(messages[saved.code] || '접수 완료를 확인하지 못했습니다. 같은 내용으로 다시 제출해 주세요.', 'error');
      controls.forEach(control => { control.disabled = false; });
      submitButton.textContent = '집행안 요청하기 ↗';
      return;
    }
    if (saved.requestId !== data.requestId) throw new Error();
    document.getElementById('receipt-id').textContent = data.requestId;
    document.getElementById('receipt-email').textContent = data.email;
    result.hidden = false;
    result.focus();
    showStatus('집행안 요청이 접수되었습니다.', 'success');
    submitButton.textContent = '접수 완료';
  } catch {
    controls.forEach(control => { control.disabled = false; });
    submitButton.textContent = '집행안 요청하기 ↗';
    showStatus('접수 완료를 확인하지 못했습니다. 입력 내용은 그대로 보관되어 있습니다. 다시 제출해 주세요.', 'error');
  } finally {
    clearTimeout(timeout);
    submitting = false;
    form.removeAttribute('aria-busy');
  }
});

document.getElementById('new-request').addEventListener('click', () => {
  form.reset();
  pendingRequest = null;
  [...form.elements].forEach(control => { control.disabled = false; });
  result.hidden = true;
  showStatus('', '');
  submitButton.textContent = '집행안 요청하기 ↗';
  form.elements.company.focus();
});
