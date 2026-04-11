document.addEventListener('DOMContentLoaded', function () {
    // ---------- FORM SUBMIT ----------
    const orderForm = document.getElementById('orderForm');

    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'پروسیسنگ ہو رہی ہے...';
                submitBtn.style.opacity = '0.7';
            }

            try {
                const res = await fetch("https://software.alishahquraishi.site/api/order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                let result;
                try {
                    result = await res.json();
                } catch (parseError) {
                    alert('آرڈر ناکام! سرور سے غلط جواب ملا۔ دوبارہ کوشش کریں۔');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                        submitBtn.style.opacity = '1';
                    }
                    return;
                }

                if (result.success) {
                    const name = (result.data && result.data.name) ? result.data.name : (data.name || '');
                    window.location.href = `success.html?name=${encodeURIComponent(name)}`;
                } else {
                    let errorMsg = result.message || 'دوبارہ کوشش کریں۔';
                    if (errorMsg.includes('phone number')) {
                        errorMsg = 'براہ کرم درست فون نمبر درج کریں';
                    }
                    alert('آرڈر ناکام!\n' + errorMsg);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                        submitBtn.style.opacity = '1';
                    }
                }

            } catch (error) {
                alert('کنکشن ایرر! براہ کرم اپنا انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.opacity = '1';
                }
            }
        });
    }

    // ---------- DISCOUNT SPINNER ----------
    const spinner = document.getElementById('spinner');
    const spinBtn = document.getElementById('spin-btn');
    const resultDiv = document.getElementById('result');

    if (!spinner || !spinBtn || !resultDiv) return;

    const discounts = ['10%', '20%', '30%', '40%', '50%', 'FREE'];
    const segmentAngle = 360 / discounts.length;
    const basePrice = 11999;

    // Add labels
    discounts.forEach((discount, index) => {
        const angle = index * segmentAngle;
        const label = document.createElement('div');
        label.className = 'en';
        label.textContent = discount;
        label.style.position = 'absolute';
        label.style.left = '50%';
        label.style.top = '50%';
        label.style.color = 'white';
        label.style.fontWeight = '900';
        label.style.fontSize = '1.2rem';
        label.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';
        label.style.transform = `translate(-50%, -50%) rotate(${angle + segmentAngle / 2}deg) translateY(-100px) rotate(-${angle + segmentAngle / 2}deg)`;
        spinner.appendChild(label);
    });

    let hasSpun = false;

    spinBtn.addEventListener('click', function () {
        if (hasSpun) return;

        hasSpun = true;
        spinBtn.disabled = true;
        spinBtn.textContent = 'صبر کریں...';

        // Target 50% (index 4)
        const rotations = 5 * 360;
        const targetAngle = 360 - (4 * segmentAngle + segmentAngle / 2);
        const totalRotation = rotations + targetAngle;

        spinner.style.transform = `rotate(${totalRotation}deg)`;

        setTimeout(function () {
            const discValue = 50;
            const finalPrice = Math.round(basePrice * 0.5);

            resultDiv.innerHTML = `
                <div style="background: white; padding: 2.5rem; border-radius: 2rem; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border: 2px solid var(--accent); max-width: 400px; margin: 0 auto;">
                    <h3 style="color: var(--primary); font-size: 1.8rem; margin-bottom: 1rem;">مبارک ہو!</h3>
                    <p style="font-size: 1.25rem;">آپ کو <span class="en" style="color: var(--accent); font-weight: 900;">50%</span> خصوصی رعایت ملی ہے۔</p>
                    <hr style="margin: 1.5rem 0; border: none; border-top: 1px dashed #eee;">
                    <p style="font-size: 1.1rem; opacity: 0.7;">اصل قیمت: <span class="en">PKR ${basePrice}</span></p>
                    <p style="font-size: 2.2rem; font-weight: 900; color: var(--primary); margin-top: 0.5rem;"><span class="en">PKR ${finalPrice}</span></p>
                    <a href="#order" style="display: block; margin-top: 1.5rem; color: var(--accent); text-decoration: none; font-weight: 700;">آرڈر بک کرنے کے لیے نیچے جائیں &darr;</a>
                </div>
            `;
            resultDiv.style.opacity = '1';
            spinBtn.textContent = "کامیاب ہو گیا!";
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 4000);
    });
});