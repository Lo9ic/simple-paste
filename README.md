# Simple Paste (No storage)

This is a super-simple pastebin-like app with no backend. Your text is compressed and encoded into the URL hash, so nothing is stored on any server. Share the link to view the text on any device.

## Files
- index.html — single-file app with inline styles and JS.

## How to use
1. Open the file directly in a browser:
   - macOS: open simple-paste/index.html
   - Or drag-drop it into your browser window.
2. Type or paste your text.
3. Click “Create/refresh link” to generate a shareable URL.
4. Click “Copy link” and share it. The recipient opens the link to view and copy the text.

## Local server (optional)
Running via a local server avoids some browser clipboard security limitations:

- Python 3
  python3 -m http.server 8080 -d simple-paste
  # Then open http://localhost:8080/

- Node (npx serve)
  npx serve simple-paste -l 8080

## Notes
- Privacy: The text sits after the # in the URL, which is never sent to the server, even when the page loads.
- Limits: Very large texts make very long links. Many browsers can handle large URLs, but some apps may truncate them.
- No auth, no storage: exactly as requested.
