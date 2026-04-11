document.addEventListener('DOMContentLoaded', function () {
  // ---------- FORM SUBMIT (SAFE FOR ALL PAGES) ----------
  const orderForm = document.getElementById('orderForm');

  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // stop normal form reload

      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      console.log('Sending data:', data);

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
      }

      try {
        const res = await fetch("https://software.alishahquraishi.site/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        console.log('Response status:', res.status);

        // Try to parse JSON response (even for error responses)
        let result;
        try {
          result = await res.json();
          console.log('API Response:', result);
        } catch (parseError) {
          console.warn('Failed to parse JSON response:', parseError);
          alert('آرڈر ناکام! سرور سے غلط جواب ملا۔ دوبارہ کوشش کریں۔');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
          return;
        }

        // Check if order was successfully placed
        if (result.success) {
          const name = (result.data && result.data.name) ? result.data.name : (data.name || '');
          window.location.href = "success.html?name=" + encodeURIComponent(name);
        } else {
          // Show server's error message
          console.log('Order failed:', result);
          let errorMsg = result.message || 'دوبارہ کوشش کریں۔';
          
          // Translate common error messages to Urdu
          if (errorMsg.includes('phone number')) {
            errorMsg = 'براہ کرم درست فون نمبر درج کریں (مثال: 03001234567)';
          } else if (errorMsg.includes('name')) {
            errorMsg = 'براہ کرم اپنا نام درج کریں';
          } else if (errorMsg.includes('address')) {
            errorMsg = 'براہ کرم اپنا پتہ درج کریں';
          } else if (errorMsg.includes('city')) {
            errorMsg = 'براہ کرم شہر کا نام درج کریں';
          }
          
          alert('آرڈر ناکام!\n' + errorMsg);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        }

      } catch (error) {
        console.error('Network or fetch error:', error);
        alert('کنکشن ایرر! براہ کرم اپنا انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // ---------- DISCOUNT SPINNER (SAFE FOR ALL PAGES) ----------
  const spinner = document.getElementById('spinner');
  const spinBtn = document.getElementById('spin-btn');
  const result = document.getElementById('result');

  // If this page doesn't have a spinner, just skip this part
  if (!spinner || !spinBtn || !result) {
    return;
  }

  const discounts = ['10%', '20%', '30%', '40%', '50%'];
  const segmentAngle = 360 / discounts.length;
  const basePrice = 11999;

  // Add discount labels
  discounts.forEach((discount, index) => {
    const angle = index * segmentAngle;
    const label = document.createElement('div');
    label.className = 'absolute inset-0 w-full h-full text-center text-white font-bold text-xl flex justify-center pt-8 origin-center z-20 pointer-events-none transform transition-none';
    label.style.transform = `rotate(${angle + segmentAngle / 2}deg)`;
    label.innerHTML = `<span style="transform: rotate(-90deg) translateY(-5px); display: inline-block; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));">${discount}</span>`;
    spinner.appendChild(label);
  });

  let hasSpun = false;

  spinBtn.addEventListener('click', function () {
    if (hasSpun) return;

    hasSpun = true;
    spinBtn.disabled = true;
    result.classList.remove('visible');

    // Start from random
    const startRotation = Math.floor(Math.random() * 360);
    spinner.style.transform = `rotate(${startRotation}deg)`;
    void spinner.offsetWidth; // reset animation

    // Always land on 50% (index 4, center at 288°)
    const targetSegmentCenter = 288;
    const startMod = startRotation % 360;
    let rotationNeeded = startMod < targetSegmentCenter
      ? targetSegmentCenter - startMod
      : 360 - (startMod - targetSegmentCenter);

    const totalRotation = startRotation + 360 + rotationNeeded;
    spinner.style.transform = `rotate(${totalRotation}deg)`;

    setTimeout(function () {
      const discountValue = 50;
      const discountAmount = Math.round((discountValue / 100) * basePrice);
      const finalPrice = basePrice - discountAmount;

      result.innerHTML = `
         مبارک ہو! آپ کو <strong>${discountValue}%</strong> کی رعایت ملی۔<br>
        اصل قیمت: <strong>PKR ${basePrice}</strong><br>
        رعایت: <strong>PKR ${discountAmount}</strong><br>
        اب آپ صرف ادا کریں گے۔: <strong>PKR ${finalPrice}</strong> 
      `;
      result.classList.add('visible');
      spinBtn.textContent = "اسپن ہو چکی ہے";
    }, 3000);
  });
});