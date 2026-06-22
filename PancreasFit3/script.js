document.addEventListener('DOMContentLoaded', function () {

  const citySelects = document.querySelectorAll('select[name="city"]');
  if (citySelects.length > 0) {
    const tryFetch = (paths) => {
      if (!paths.length) return;
      fetch(paths[0])
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(cities => {
          cities.forEach(c => {
            citySelects.forEach(select => {
              const opt = document.createElement('option');
              opt.value = c; opt.textContent = c;
              select.appendChild(opt.cloneNode(true));
            });
          });
        })
        .catch(() => tryFetch(paths.slice(1)));
    };
    tryFetch(['../cities.json', '../../cities.json', 'cities.json']);
    initSearchableCities();
  }

  const orderForms = document.querySelectorAll('form[id="orderForm"], form.quickOrderForm');
  orderForms.forEach(orderForm => {
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
  });

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

  document.querySelectorAll('.reveal').forEach(function (el) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.08 }).observe(el);
  });
});


// Searchable city dropdown utility
function initSearchableCities() {
  const citySelects = document.querySelectorAll('select[name="city"]');
  if (citySelects.length === 0) return;

  // 1. Inject Styles dynamically if not already injected
  if (!document.getElementById('searchable-select-styles')) {
    const styles = document.createElement('style');
    styles.id = 'searchable-select-styles';
    styles.innerHTML = `
      .searchable-select-wrapper {
        position: relative;
        width: 100%;
        font-family: inherit;
        text-align: right;
      }
      .searchable-select-trigger {
        width: 100%;
        padding: 0.75rem 1rem;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        font-size: 1rem;
        color: #333;
        transition: border-color 0.2s, box-shadow 0.2s;
        min-height: 48px;
      }
      .searchable-select-trigger:focus,
      .searchable-select-wrapper.active .searchable-select-trigger {
        border-color: #dc2626;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
        outline: none;
      }
      .searchable-select-trigger span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 10px;
      }
      .searchable-select-trigger i {
        font-size: 0.85rem;
        color: #888;
        transition: transform 0.2s;
        margin-right: auto;
        margin-left: 0;
      }
      .searchable-select-wrapper.active .searchable-select-trigger i {
        transform: rotate(180deg);
      }
      .searchable-select-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-top: 4px;
        max-height: 300px;
        overflow: hidden;
        display: none;
        flex-direction: column;
        z-index: 99999;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }
      .searchable-select-wrapper.active .searchable-select-dropdown {
        display: flex;
      }
      .searchable-select-search-box {
        padding: 8px 10px;
        border-bottom: 1px solid #eee;
        background: #fdfdfd;
      }
      .searchable-select-search-box input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 0.95rem;
        outline: none;
        box-sizing: border-box;
        text-align: right;
        direction: rtl;
      }
      .searchable-select-search-box input:focus {
        border-color: #dc2626;
      }
      .searchable-select-options {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 200px;
        overflow-y: auto;
      }
      .searchable-select-option {
        padding: 10px 16px;
        cursor: pointer;
        font-size: 0.95rem;
        color: #333;
        transition: background 0.15s, color 0.15s;
        text-align: right;
      }
      .searchable-select-option:hover {
        background: #f3f4f6;
        color: #dc2626;
      }
      .searchable-select-option.selected {
        background: #fef2f2;
        color: #dc2626;
        font-weight: 700;
      }
      .searchable-select-no-results {
        padding: 12px 16px;
        color: #888;
        font-size: 0.9rem;
        text-align: center;
        display: none;
      }
    `;
    document.head.appendChild(styles);
  }

  citySelects.forEach(citySelect => {
  // 2. Hide original select
  citySelect.style.display = 'none';

  // 3. Create searchable component markup
  const wrapper = document.createElement('div');
  wrapper.className = 'searchable-select-wrapper';

  const trigger = document.createElement('div');
  trigger.className = 'searchable-select-trigger';
  trigger.setAttribute('tabindex', '0');
  trigger.innerHTML = `
    <span class="selected-text">-- شہر منتخب کریں --</span>
    <i class="fas fa-chevron-down"></i>
  `;

  const dropdown = document.createElement('div');
  dropdown.className = 'searchable-select-dropdown';

  const searchBox = document.createElement('div');
  searchBox.className = 'searchable-select-search-box';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'شہر تلاش کریں...';
  searchBox.appendChild(searchInput);

  const optionsContainer = document.createElement('ul');
  optionsContainer.className = 'searchable-select-options';

  const noResults = document.createElement('div');
  noResults.className = 'searchable-select-no-results';
  noResults.textContent = 'کوئی شہر نہیں ملا';

  dropdown.appendChild(searchBox);
  dropdown.appendChild(optionsContainer);
  dropdown.appendChild(noResults);

  wrapper.appendChild(trigger);
  wrapper.appendChild(dropdown);

  // Insert wrapper after the select
  citySelect.parentNode.insertBefore(wrapper, citySelect.nextSibling);

  // Function to rebuild options from the original select
  function rebuildOptions() {
    optionsContainer.innerHTML = '';
    const selectOptions = citySelect.querySelectorAll('option');
    let hasSelected = false;

    selectOptions.forEach(opt => {
      // Skip empty placeholder option but read its text if selected
      if (opt.value === "") {
        if (opt.selected) {
          trigger.querySelector('.selected-text').textContent = opt.textContent;
          hasSelected = true;
        }
        return;
      }

      const li = document.createElement('li');
      li.className = 'searchable-select-option';
      li.textContent = opt.textContent;
      li.dataset.value = opt.value;

      if (opt.selected) {
        li.classList.add('selected');
        trigger.querySelector('.selected-text').textContent = opt.textContent;
        hasSelected = true;
      }

      li.addEventListener('click', () => {
        selectOption(opt.value, opt.textContent);
      });

      optionsContainer.appendChild(li);
    });

    if (!hasSelected) {
      trigger.querySelector('.selected-text').textContent = selectOptions[0] ? selectOptions[0].textContent : '-- شہر منتخب کریں --';
    }
  }

  function selectOption(value, text) {
    citySelect.value = value;
    citySelect.dispatchEvent(new Event('change', { bubbles: true }));
    trigger.querySelector('.selected-text').textContent = text;
    closeDropdown();
  }

  function toggleDropdown() {
    const isActive = wrapper.classList.contains('active');
    if (isActive) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  function openDropdown() {
    document.querySelectorAll('.searchable-select-wrapper.active').forEach(w => {
      w.classList.remove('active');
    });
    wrapper.classList.add('active');
    searchInput.value = '';
    filterOptions('');
    setTimeout(() => searchInput.focus(), 50);
  }

  function closeDropdown() {
    wrapper.classList.remove('active');
  }

  function filterOptions(query) {
    const q = query.toLowerCase().trim();
    const options = optionsContainer.querySelectorAll('.searchable-select-option');
    let matchCount = 0;

    options.forEach(li => {
      const text = li.textContent.toLowerCase();
      if (text.includes(q)) {
        li.style.display = '';
        matchCount++;
      } else {
        li.style.display = 'none';
      }
    });

    noResults.style.display = matchCount === 0 ? 'block' : 'none';
  }

  // Event Listeners
  trigger.addEventListener('click', toggleDropdown);
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      openDropdown();
    }
  });

  searchInput.addEventListener('input', (e) => {
    filterOptions(e.target.value);
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      closeDropdown();
    }
  });

  rebuildOptions();

  // MutationObserver to automatically rebuild options if original select dynamically loads options
  const observer = new MutationObserver(() => {
    rebuildOptions();
  });
  observer.observe(citySelect, { childList: true, subtree: true });
  });
}
