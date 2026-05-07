# Better Trac

Browser extension for [trac.brightpattern.com](https://trac.brightpattern.com). Supports Chrome and Firefox.

Adds:

1. **Inline attachment previews** — renders images, videos, zip contents, and HAR files directly on ticket pages.

   ![Video preview](.github/assets/video-preview.png)
   ![Zip preview](.github/assets/zip-preview.png)

2. **Paste to upload** — `Ctrl+V`/`Cmd+V` outside a text field opens the upload page in a new tab; pasting an image on the upload page fills the file input automatically.

3. **Image Combiner** — click the extension icon to paste, arrange, and combine screenshots into one image, then copy to clipboard.

   ![Image Combiner](.github/assets/image-combiner.png)

## Installation

### Option A — Download release

Download the latest `.zip` from [GitHub Releases](https://github.com/ServicePattern/better-trac/releases) and unzip it.

### Option B — Build from source

```
yarn install
yarn build
```

Output goes to `dist/`.

---

### Load in Chrome

1. Go to [chrome://extensions/](chrome://extensions/)
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** → select the `dist/` folder.

### Load in Firefox

1. Go to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
2. Click **Load Temporary Add-on** → select any file inside `dist/`.
