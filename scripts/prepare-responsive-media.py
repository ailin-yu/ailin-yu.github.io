"""Generate progressive previews and mobile WebP assets; never overwrite originals.

Requires Pillow. SVG previews optionally use @resvg/resvg-js from --resvg.
Originals and the processing report are copied into the user's materials library.
"""
import argparse
import base64
import hashlib
import io
import json
import shutil
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--resvg', type=Path)
parser.add_argument('--node', default='node')
parser.add_argument('--archive', type=Path, required=True)
args = parser.parse_args()
sources = [p for folder in ['cases', 'influence'] for p in (PUBLIC / folder).rglob('*')
           if p.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp', '.svg'}]
sources += [PUBLIC / 'home/work/webide.webp', PUBLIC / 'home/work/BG-06.webp']
manifest = {}
report = []
for source in sorted(set(sources)):
    relative = source.relative_to(PUBLIC)
    if source.suffix == '.svg' and not args.resvg:
        continue
    if source.suffix == '.svg':
        # Resvg preserves all crops, transforms and embedded source bitmaps.
        code = "const fs=require('fs');const {Resvg}=require(process.argv[1]);process.stdout.write(new Resvg(fs.readFileSync(process.argv[2]),{fitTo:{mode:'width',value:1280},font:{loadSystemFonts:true}}).render().asPng())"
        result = subprocess.run([args.node, '-e', code, str(args.resvg), str(source)], capture_output=True, check=True)
        image = Image.open(io.BytesIO(result.stdout)).convert('RGBA')
    else:
        image = Image.open(source)
        if getattr(image, 'is_animated', False):
            continue
        image = image.convert('RGBA')
    saved = args.archive / '原件' / relative
    saved.parent.mkdir(parents=True, exist_ok=True)
    if saved.exists():
        assert saved.read_bytes() == source.read_bytes(), f'Archive differs: {relative}'
    else:
        shutil.copy2(source, saved)
    small = image.copy()
    small.thumbnail((36, 72), Image.Resampling.LANCZOS)
    buffer = io.BytesIO()
    small.save(buffer, 'WEBP', quality=28, method=6)
    variants = []
    for limit in [640, 960]:
        width = min(image.width, limit)
        if variants and width == variants[-1]['width']:
            continue
        output = image.resize((width, max(1, round(image.height * width / image.width))), Image.Resampling.LANCZOS)
        data = io.BytesIO()
        output.save(data, 'WEBP', quality=84, method=6)
        digest = hashlib.sha256(data.getvalue()).hexdigest()[:10]
        destination = Path('media') / relative.parent / f'{source.stem}-{width}-{digest}.webp'
        path = PUBLIC / destination
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data.getvalue())
        variants.append({'src': '/' + destination.as_posix(), 'width': width})
    manifest['/' + relative.as_posix()] = {
        'width': image.width, 'height': image.height,
        'preview': 'data:image/webp;base64,' + base64.b64encode(buffer.getvalue()).decode(),
        'variants': variants,
    }
    report.append({'source': relative.as_posix(), 'sourceBytes': source.stat().st_size,
                   'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
                   'previewBytes': len(buffer.getvalue()),
                   'variants': [{'file': v['src'], 'bytes': (PUBLIC / v['src'].lstrip('/')).stat().st_size} for v in variants]})
output = ROOT / 'src/content/media-images.generated.json'
output.write_text(json.dumps(manifest, ensure_ascii=False, separators=(',', ':')) + '\n')
(args.archive / '处理记录.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(f'{len(manifest)} images; {sum(x["previewBytes"] for x in report):,} preview bytes; originals retained at {args.archive}', flush=True)
