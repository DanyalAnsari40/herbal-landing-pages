import os

BASE = r'd:\Software House pending work\herbal-landing-pages'
log = []

replacements = [
    # labels
    ('<label>address</label>', '<label>گھر کا پتہ</label>'),
    ('<label>city</label>', '<label>شہر منتخب کریں</label>'),
    ('<label for="address" class="block text-gray-500 text-sm mb-1 font-semibold">address</label>', '<label for="address" class="block text-gray-500 text-sm mb-1 font-semibold">گھر کا پتہ</label>'),
    ('<label for="city" class="block text-gray-500 text-sm mb-1 font-semibold">city</label>', '<label for="city" class="block text-gray-500 text-sm mb-1 font-semibold">شہر منتخب کریں</label>'),
    ('<label for="address" class="block text-gray-600 font-semibold mb-2 text-sm">address</label>', '<label for="address" class="block text-gray-600 font-semibold mb-2 text-sm">گھر کا پتہ</label>'),
    ('<label for="city" class="block text-gray-600 font-semibold mb-2 text-sm">city</label>', '<label for="city" class="block text-gray-600 font-semibold mb-2 text-sm">شہر منتخب کریں</label>'),
    # placeholders
    ('placeholder="enter address"', 'placeholder="گھر کا پتہ درج کریں"'),
    ('placeholder="address"', 'placeholder="گھر کا پتہ درج کریں"'),
    ('placeholder="enter address" required', 'placeholder="گھر کا پتہ درج کریں" required'),
    # city dropdown default option
    ('<option value="">-- select city --</option>', '<option value="">-- شہر منتخب کریں --</option>'),
]

for root, dirs, files in os.walk(BASE):
    for fname in files:
        if fname != 'index.html':
            continue
        path = os.path.join(root, fname)
        html = open(path, encoding='utf-8', errors='ignore').read()
        changed = False
        for old, new in replacements:
            if old in html:
                html = html.replace(old, new)
                changed = True
        if changed:
            open(path, 'w', encoding='utf-8').write(html)
            log.append('updated: ' + os.path.relpath(path, BASE))

open(os.path.join(BASE, 'fix_log.txt'), 'w', encoding='utf-8').write('\n'.join(log))
print('done')
