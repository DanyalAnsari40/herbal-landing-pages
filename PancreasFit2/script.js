document.addEventListener('DOMContentLoaded', function () {

  // Load cities into dropdown
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

  // Order Form Submit
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
            customerName: data.name,
            phone: data.phone,
            address: data.address,
            city: data.city,
            product: data.productName,
            source: 'landing-page'
          })
        });

        let result;
        try { result = await res.json(); } catch {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
          return;
        }

        if (result.order) {
          window.location.href = 'success.html?name=' + encodeURIComponent(data.name || '');
        } else {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
        }
      } catch {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
      }
    });
  }

  // Discount Spinner
  const spinner = document.getElementById('spinner');
  const spinBtn = document.getElementById('spin-btn');
  const spinPopup = document.getElementById('spin-popup');
  const spinPopupClose = document.getElementById('spin-popup-close');
  const spinPopupBackdrop = document.getElementById('spin-popup-backdrop');
  const spinPopupOrder = document.getElementById('spin-popup-order');
  if (!spinner || !spinBtn) return;

  const ORIGINAL_PRICE = 12000;
  const DISCOUNTED_PRICE = 7500;
  const savings = ORIGINAL_PRICE - DISCOUNTED_PRICE;
  const discountPercent = Math.round((savings / ORIGINAL_PRICE) * 1000) / 10;

  const discounts = ['10%', '20%', '30%', '35%', discountPercent + '%'];
  const segmentAngle = 360 / discounts.length;
  const winningSegmentIndex = discounts.length - 1;

  function formatPrice(amount) {
    return 'PKR ' + amount.toLocaleString('en-PK');
  }

  function openSpinPopup() {
    if (!spinPopup) return;
    const msg = document.getElementById('spin-discount-msg');
    const originalEl = document.getElementById('spin-original-price');
    const finalEl = document.getElementById('spin-final-price');
    if (msg) {
      msg.innerHTML = 'آپ کو <strong>' + discountPercent + '%</strong> کی خصوصی رعایت ملی — بچت: <strong class="en">' + formatPrice(savings) + '</strong>';
    }
    if (originalEl) originalEl.textContent = formatPrice(ORIGINAL_PRICE);
    if (finalEl) finalEl.textContent = formatPrice(DISCOUNTED_PRICE);
    spinPopup.classList.add('is-open');
    spinPopup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSpinPopup() {
    if (!spinPopup) return;
    spinPopup.classList.remove('is-open');
    spinPopup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  spinPopupClose?.addEventListener('click', closeSpinPopup);
  spinPopupBackdrop?.addEventListener('click', closeSpinPopup);
  spinPopupOrder?.addEventListener('click', closeSpinPopup);

  discounts.forEach((discount, index) => {
    const angle = index * segmentAngle;
    const label = document.createElement('div');
    label.className = 'discount-label';
    label.textContent = discount;
    label.style.cssText = 'position:absolute;left:50%;top:50%;color:white;font-weight:900;font-size:1.2rem;text-shadow:0 2px 4px rgba(0,0,0,0.7);pointer-events:none;z-index:20;';
    label.style.transform = 'translate(-50%,-50%) rotate(' + (angle + segmentAngle/2) + 'deg) translateY(-110px) rotate(-' + (angle + segmentAngle/2) + 'deg)';
    spinner.appendChild(label);
  });

  let hasSpun = false;
  spinBtn.addEventListener('click', function () {
    if (hasSpun) return;
    hasSpun = true;
    spinBtn.disabled = true;

    const startRotation = Math.floor(Math.random() * 360);
    spinner.style.transform = 'rotate(' + startRotation + 'deg)';
    void spinner.offsetWidth;

    const targetSegmentCenter = winningSegmentIndex * segmentAngle + segmentAngle / 2;
    const startMod = startRotation % 360;
    const rotationNeeded = startMod < targetSegmentCenter
      ? targetSegmentCenter - startMod
      : 360 - (startMod - targetSegmentCenter);
    spinner.style.transform = 'rotate(' + (startRotation + 360 + rotationNeeded) + 'deg)';

    setTimeout(function () {
      openSpinPopup();
      spinBtn.textContent = 'اسپن ہو چکی ہے';
    }, 3000);
  });
});
