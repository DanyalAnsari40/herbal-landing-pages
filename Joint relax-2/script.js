document.addEventListener('DOMContentLoaded', function () {

  const citySelect = document.getElementById('city');
  if (citySelect) {
    const tryFetch = (paths) => {
      if (!paths.length) return;
      fetch(paths[0])
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(cities => {
          cities.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c; opt.textContent = c;
            citySelect.appendChild(opt);
          });
        })
        .catch(() => tryFetch(paths.slice(1)));
    };
    tryFetch(['../cities.json', '../../cities.json', 'cities.json']);
  }

  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'processing...'; }
      try {
        const res = await fetch('https://alishahquraishi.site/api/landing-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: data.name, phone: data.phone, address: data.address,
            city: data.city, product: data.productName, source: 'landing-page'
          })
        });
        let result;
        try { result = await res.json(); } catch {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
          return;
        }
        if (result.order) {
          window.location.href = 'success.html?name=' + encodeURIComponent(data.name || '');
        } else if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
      } catch {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
      }
    });
  }

  const spinner = document.getElementById('spinner');
  const spinnerPreview = document.getElementById('spinner-preview');
  const spinBtn = document.getElementById('spin-btn');
  const result = document.getElementById('result');
  const spinModal = document.getElementById('spin-modal');
  const spinModalStatus = document.getElementById('spin-modal-status');
  const modalResult = document.getElementById('modal-result');
  const modalOrderBtn = document.getElementById('modal-order-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('spin-modal-backdrop');

  if (!spinner || !spinBtn || !spinModal) return;

  const discounts = ['10%', '20%', '30%', '40%', '50%'];
  const segmentAngle = 360 / discounts.length;
  const basePrice = 12000;
  const spinPrice = 7500;

  function addDiscountLabels(wheelEl, offsetY) {
    if (!wheelEl) return;
    discounts.forEach((discount, index) => {
      const angle = index * segmentAngle;
      const label = document.createElement('div');
      label.className = 'discount-label';
      label.textContent = discount;
      label.style.cssText = 'position:absolute;left:50%;top:50%;color:white;font-weight:900;font-size:0.95rem;text-shadow:0 2px 4px rgba(0,0,0,0.7);pointer-events:none;z-index:20;';
      label.style.transform = 'translate(-50%,-50%) rotate(' + (angle + segmentAngle / 2) + 'deg) translateY(-' + offsetY + 'px) rotate(-' + (angle + segmentAngle / 2) + 'deg)';
      wheelEl.appendChild(label);
    });
  }

  addDiscountLabels(spinnerPreview, 88);
  addDiscountLabels(spinner, 95);

  function openSpinModal() {
    spinModal.classList.add('active');
    spinModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSpinModal() {
    spinModal.classList.remove('active');
    spinModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showSpinResult() {
    const discountAmount = basePrice - spinPrice;
    const resultHTML = 'مبارک ہو! آپ کو <strong>ڈسکاؤنٹ</strong> ملی ہے!<br>اصل قیمت: <strong>PKR ' + basePrice.toLocaleString() + '</strong><br>رعایت: <strong>PKR ' + discountAmount.toLocaleString() + '</strong><br>اب آپ صرف ادا کریں گے: <strong>PKR ' + spinPrice.toLocaleString() + '</strong>';
    if (spinModalStatus) spinModalStatus.style.display = 'none';
    if (modalResult) {
      modalResult.innerHTML = resultHTML;
      modalResult.classList.add('visible');
    }
    if (modalOrderBtn) modalOrderBtn.style.display = 'inline-block';
    if (modalCloseBtn) modalCloseBtn.style.display = 'inline-block';
    if (result) {
      result.innerHTML = resultHTML;
      result.classList.add('visible');
      result.style.opacity = '1';
    }
    spinBtn.textContent = 'اسپن ہو چکی ہے';
  }

  function animateWheel(wheelEl, startRotation, finalRotation) {
    if (!wheelEl) return;
    wheelEl.style.transform = 'rotate(0deg)';
    setTimeout(function () {
      wheelEl.style.transform = 'rotate(' + startRotation + 'deg)';
      void wheelEl.offsetWidth;
      wheelEl.style.transform = 'rotate(' + finalRotation + 'deg)';
    }, 500);
  }

  let hasSpun = false;
  spinBtn.addEventListener('click', function () {
    if (hasSpun) return;
    hasSpun = true;
    spinBtn.disabled = true;

    if (modalResult) { modalResult.innerHTML = ''; modalResult.classList.remove('visible'); }
    if (modalOrderBtn) modalOrderBtn.style.display = 'none';
    if (modalCloseBtn) modalCloseBtn.style.display = 'none';
    if (spinModalStatus) { spinModalStatus.style.display = 'block'; spinModalStatus.textContent = 'وہیل گھوم رہی ہے...'; }
    if (result) { result.style.opacity = '0'; result.classList.remove('visible'); }

    const startRotation = Math.floor(Math.random() * 360);
    const targetSegmentCenter = 288;
    const startMod = startRotation % 360;
    const rotationNeeded = startMod < targetSegmentCenter ? targetSegmentCenter - startMod : 360 - (startMod - targetSegmentCenter);
    const finalRotation = startRotation + 360 + rotationNeeded;

    openSpinModal();
    animateWheel(spinner, startRotation, finalRotation);
    animateWheel(spinnerPreview, startRotation, finalRotation);
    setTimeout(showSpinResult, 4000);
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeSpinModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeSpinModal);
  if (modalOrderBtn) modalOrderBtn.addEventListener('click', closeSpinModal);
});
