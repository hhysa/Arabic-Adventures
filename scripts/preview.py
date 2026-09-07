"""Serve the Expo static export, including extensionless lesson routes."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / 'dist'

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, path):
        resolved = super().translate_path(path)
        if not Path(resolved).exists() and Path(resolved + '.html').is_file():
            return resolved + '.html'
        return resolved

if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', 8081), Handler).serve_forever()
