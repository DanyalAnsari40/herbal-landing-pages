import os

BASE = r'd:\Software House pending work\herbal-landing-pages'
log = []

# 1. Fix shared_style.css
path = os.path.join(BASE, 'shared_style.css')
css = open(path, encoding='utf-8').read()
if '.input-group select' not in css:
    css = css.replace(
        '.input-group input {',
        '.input-group input,\n.input-group select {'
    )
    css = css.replace(
        '.input-group input:focus {',
        '.input-group input:focus,\n.input-group select:focus {'
    )
    # add appearance-none before closing brace of the combined rule
    css = css.replace(
        '    text-align: right;\n    transition: var(--transition);\n}',
        '    text-align: right;\n    transition: var(--transition);\n    background: white;\n    appearance: none;\n    -webkit-appearance: none;\n    cursor: pointer;\n}'
    )
    open(path, 'w', encoding='utf-8').write(css)
    log.append('fixed shared_style.css')
else:
    log.append('shared_style.css already fixed')

# 2. Fix dibo style.css files
for folder in ['dibo1', 'dibo2', 'dibo3', 'dibo4']:
    path = os.path.join(BASE, folder, 'style.css')
    if not os.path.exists(path):
        log.append('not found: ' + path)
        continue
    css = open(path, encoding='utf-8').read()
    if '.form-group select' not in css:
        css = css.replace(
            '.form-group input {',
            '.form-group input,\n.form-group select {'
        )
        css = css.replace(
            '.form-group input:focus {',
            '.form-group input:focus,\n.form-group select:focus {'
        )
        css = css.replace(
            '    font-size: 1.1rem;\n    outline: none;\n}',
            '    font-size: 1.1rem;\n    outline: none;\n    background: white;\n    appearance: none;\n    -webkit-appearance: none;\n    cursor: pointer;\n}'
        )
        open(path, 'w', encoding='utf-8').write(css)
        log.append('fixed ' + folder + '/style.css')
    else:
        log.append(folder + '/style.css already fixed')

# 3. Fix Tailwind select elements - add appearance-none
for root, dirs, files in os.walk(BASE):
    for fname in files:
        if fname != 'index.html':
            continue
        path = os.path.join(root, fname)
        html = open(path, encoding='utf-8', errors='ignore').read()
        folder = os.path.basename(root)
        changed = False

        if 'Joint relax' in folder:
            old = 'class="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b794f4] transition text-right">\n                                        <option value="">-- select city --</option>'
            new = 'class="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b794f4] transition text-right appearance-none cursor-pointer">\n                                        <option value="">-- select city --</option>'
            if old in html:
                html = html.replace(old, new)
                changed = True

        elif 'High Power' in folder:
            old = 'class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent text-right bg-gray-50">\n                            <option value="">-- select city --</option>'
            new = 'class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandGreen focus:border-transparent text-right bg-gray-50 appearance-none cursor-pointer">\n                            <option value="">-- select city --</option>'
            if old in html:
                html = html.replace(old, new)
                changed = True

        if changed:
            open(path, 'w', encoding='utf-8').write(html)
            log.append('fixed select in ' + os.path.relpath(path, BASE))
        elif 'Joint relax' in folder or 'High Power' in folder:
            log.append('no match in ' + os.path.relpath(path, BASE))

open(os.path.join(BASE, 'fix_log.txt'), 'w', encoding='utf-8').write('\n'.join(log))
