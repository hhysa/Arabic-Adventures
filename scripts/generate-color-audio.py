"""Generate bundled Arabic color or number speech; playback never calls this service.

Run npm run audio:sync first. Existing clips are preserved; delete a clip
explicitly before regenerating it after a vocabulary change.
"""
import argparse
import json
from pathlib import Path
import time
import urllib.parse
import urllib.request

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('category', nargs='?', choices=['colors', 'numbers'], default='colors')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent / 'assets' / 'audio' / args.category
words = json.loads((root / 'words.json').read_text(encoding='utf-8'))
for color_id, arabic in words.items():
    destination = root / f'{color_id}.mp3'
    if destination.exists() and destination.stat().st_size > 1000:
        continue
    query = urllib.parse.urlencode({
        'ie': 'UTF-8', 'client': 'tw-ob', 'tl': 'ar', 'q': arabic,
    })
    request = urllib.request.Request(
        'https://translate.google.com/translate_tts?' + query,
        headers={'User-Agent': 'Mozilla/5.0'},
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                content_type = response.headers.get_content_type()
                data = response.read()
            if content_type != 'audio/mpeg' or len(data) < 1000:
                raise ValueError(f'Invalid audio response for {color_id}')
            destination.write_bytes(data)
            print(color_id, len(data), flush=True)
            break
        except Exception:
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))
    time.sleep(0.2)
