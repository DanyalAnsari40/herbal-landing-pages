import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'cities.json'

if not SOURCE.exists():
    raise SystemExit(f'Error: source file not found: {SOURCE}')

copied = []
skipped = []

for dirpath, dirnames, filenames in os.walk(ROOT):
    current = Path(dirpath)
    if current == ROOT:
        continue
    if '.git' in current.parts:
        continue
    if 'index.html' in filenames or 'script.js' in filenames:
        dest = current / 'cities.json'
        shutil.copy2(SOURCE, dest)
        copied.append(str(dest.relative_to(ROOT)))
    else:
        skipped.append(str(current.relative_to(ROOT)))

print('Copied cities.json into folders:')
for path in copied:
    print(f' - {path}')

if skipped:
    print('\nSkipped folders without page files:')
    for path in skipped:
        print(f' - {path}')

print(f'\nTotal copied: {len(copied)}')
