LANDING4 - cPanel Deployment
============================

Upload these to your domain root (public_html or domain folder):

  - index.html      (main page)
  - success.html    (order confirmation page)
  - script.js       (form + spinner logic)
  - .htaccess       (HTTPS redirect + favicon rewrite)
  - images/         (entire folder with all images)

After upload, visit: https://yourdomain.com/
(Use HTTPS. .htaccess will redirect HTTP to HTTPS.)

---
If you see 436 or 441 errors (Chrome: "Failed to load resource... 436 / 441"):
-------------------------------------------------------------
These are SERVER-side codes from your host. Fix in cPanel:

1. SSL certificate
   - cPanel → SSL/TLS Status → install/assign certificate for your domain.
   - Use "Let's Encrypt" if no certificate.

2. Force HTTPS
   - cPanel → Domains → your domain → Redirects.
   - Add "Permanent (301) redirect" from http to https.

3. Favicon 441
   - .htaccess now rewrites /favicon.ico to images/fav.jpg.
   - Ensure .htaccess is uploaded and Apache "AllowOverride" allows it.

4. Index 436
   - Usually SSL or domain config. After SSL is OK, open the site with https:// only.
   - Clear browser cache and try again.
