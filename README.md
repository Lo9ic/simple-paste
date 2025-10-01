# Simple Paste (Personal, single link)

A super-simple paste app for personal use. There is only one page/link. Your text is saved locally in your browser (localStorage). No backend. No accounts.

## Files
- index.html — single-file app with inline styles and JS.

## How to use
1. Open the file in a browser:
   - macOS: open simple-paste/index.html
   - Or serve locally and visit http://localhost:8080 (see below)
2. Type or paste your text.
3. Click “Save” to store it locally in this browser.
4. Click “Reload” to load whatever was last saved locally.
5. Click “Copy” to copy the current text to your clipboard.

## Local server (optional)
Running via a local server avoids some clipboard security limitations:

- Python 3
  python3 -m http.server 8080 -d simple-paste
  # Then open http://localhost:8080/

- Node (npx serve)
  npx serve simple-paste -l 8080

## Notes
- Storage is local to the browser/device. It won’t sync across devices or when using private mode.
- Clearing site data or switching browsers/devices will remove the saved text.
- Buttons: Reload, Save, Copy.
