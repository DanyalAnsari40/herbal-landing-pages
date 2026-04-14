import os

BASE = r'd:\Software House pending work\herbal-landing-pages'

NEW_SCRIPT = """document.addEventListener('DOMContentLoaded', function () {

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
          alert('order failed - bad server response');
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
          return;
        }

        if (result.success) {
          const name = (result.data && result.data.name) ? result.data.name : (data.name || '');
          window.location.href = 'success.html?name=' + encodeURIComponent(name);
        } else {
          let msg = result.message || 'please try again';
          if (msg.includes('phone')) msg = 'please enter a valid phone number (e.g. 03001234567)';
          else if (msg.includes('name')) msg = 'please enter your name';
          else if (msg.includes('address')) msg = 'please enter your address';
          else if (msg.includes('city')) msg = 'please select a city';
          alert('Order failed: ' + msg);
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
        }
      } catch {
        alert('Connection error - please check your internet and try again');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
      }
    });
  }

  // Discount Spinner
  const spinner = document.getElementById('spinner');
  const spinBtn = document.getElementById('spin-btn');
  const result  = document.getElementById('result');
  if (!spinner || !spinBtn || !result) return;

  const discounts = ['10%', '20%', '30%', '40%', '50%'];
  const segmentAngle = 360 / discounts.length;
  const basePrice = 11999;

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
    result.classList.remove('visible');

    const startRotation = Math.floor(Math.random() * 360);
    spinner.style.transform = 'rotate(' + startRotation + 'deg)';
    void spinner.offsetWidth;

    const targetSegmentCenter = 288;
    const startMod = startRotation % 360;
    const rotationNeeded = startMod < targetSegmentCenter
      ? targetSegmentCenter - startMod
      : 360 - (startMod - targetSegmentCenter);
    spinner.style.transform = 'rotate(' + (startRotation + 360 + rotationNeeded) + 'deg)';

    setTimeout(function () {
      const discountAmount = Math.round(0.5 * basePrice);
      const finalPrice = basePrice - discountAmount;
      result.innerHTML = 'Mubarak ho! Aap ko <strong>50%</strong> ki riyayat mili.<br>Asal qeemat: <strong>PKR ' + basePrice + '</strong><br>Riyayat: <strong>PKR ' + discountAmount + '</strong><br>Ab aap sirf ada karen ge: <strong>PKR ' + finalPrice + '</strong>';
      result.classList.add('visible');
      result.style.opacity = '1';
      spinBtn.textContent = 'Spin ho chuki hai';
    }, 3000);
  });
});
"""

ADDRESS_CITY_TAILWIND = """                                <div class="mb-5 relative">
                                    <label for="address" class="block text-gray-500 text-sm mb-1 font-semibold">address</label>
                                    <input type="text" name="address" id="address" required class="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b794f4] transition text-right" placeholder="address">
                                </div>
                                <div class="mb-5 relative">
                                    <label for="city" class="block text-gray-500 text-sm mb-1 font-semibold">city</label>
                                    <select name="city" id="city" required class="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b794f4] transition text-right">
                                        <option value="">-- select city --</option>
                                    </select>
                                </div>
"""

ADDRESS_CITY_BP = """                        <div class="input-group">
                            <label>address</label>
                            <input type="text" name="address" id="address" placeholder="enter address" required>
                        </div>
                        <div class="input-group">
                            <label>city</label>
                            <select name="city" id="city" required>
                                <option value="">-- select city --</option>
                            </select>
                        </div>
"""

ADDRESS_CITY_HP = """                    <div class="mb-5">
                        <label for="address" class="block text-gray-600 font-semibold mb-2 text-sm">address</label>
                        <input type="text" name="address" id="address" placeholder="enter address" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent text-right bg-gray-50">
                    </div>
                    <div class="mb-5">
                        <label for="city" class="block text-gray-600 font-semibold mb-2 text-sm">city</label>
                        <select name="city" id="city" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent text-right bg-gray-50">
                            <option value="">-- select city --</option>
                        </select>
                    </div>
"""

ADDRESS_CITY_DIBO = """                    <div class="form-group">
                        <label>address</label>
                        <input type="text" name="address" placeholder="enter address" required>
                    </div>
                    <div class="form-group">
                        <label>city</label>
                        <select name="city" id="city" required>
                            <option value="">-- select city --</option>
                        </select>
                    </div>
"""

HIDDEN_INPUT = '<input type="hidden" name="productName"'

def update_script(path):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(NEW_SCRIPT)
    print('OK script.js: ' + path)

def update_html(path):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()

    if 'name="address"' in html or "name='address'" in html:
        print('SKIP (already has address): ' + path)
        return

    if HIDDEN_INPUT not in html:
        print('WARN (no hidden productName found): ' + path)
        return

    folder = os.path.basename(os.path.dirname(path))

    if 'Joint relax' in folder:
        snippet = ADDRESS_CITY_TAILWIND + '                                ' + HIDDEN_INPUT
    elif 'B.p Fitness' in folder:
        snippet = ADDRESS_CITY_BP + '                        ' + HIDDEN_INPUT
    elif 'High Power' in folder:
        snippet = ADDRESS_CITY_HP + '                    ' + HIDDEN_INPUT
    else:
        snippet = ADDRESS_CITY_DIBO + '                    ' + HIDDEN_INPUT

    updated = html.replace(HIDDEN_INPUT, snippet, 1)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(updated)
    print('OK index.html: ' + path)


print('=== Updating script.js files ===')
for root, dirs, files in os.walk(BASE):
    for fname in files:
        if fname == 'script.js':
            update_script(os.path.join(root, fname))

print('\n=== Updating index.html forms ===')
for root, dirs, files in os.walk(BASE):
    for fname in files:
        if fname == 'index.html':
            update_html(os.path.join(root, fname))

print('\nAll done!')
