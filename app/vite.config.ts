import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    /**
     * Cache-bust static assets whose filenames are content-stable
     * (e.g. /locations/<x>.webp, /show-me-on-the-booth.jpg).
     *
     * Vite already hashes JS/CSS bundle filenames (assets/index-<hash>.js),
     * so we leave those alone — adding ?v on top would be redundant.
     * GitHub Pages serves Cache-Control: max-age=600, so any rename
     * triggers a refetch, but content-replacement keeps the URL stable
     * → we need ?v=<sha> to force the browser to bypass the cache.
     */
    cacheBustStaticAssets(),
  ],
  build: {
    // Pinning `target` explicitly (instead of relying on Vite's default
    // `"modules"`) ensures Vite/esbuild down-levels syntax that newer Chrome
    // supports but constrained Android 9 builds do not (e.g. ES2022 class
    // fields, top-level await). The matching `.browserslistrc` lists the
    // minimum environment we still want to support.
    target: 'es2019',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        debug: resolve(__dirname, 'debug.html'),
      },
    },
  },
  // When deploying to GitHub Pages under a branch-name subfolder,
  // set the VITE_BASE env var (e.g. "/repo/branch-name/").
  base: process.env.VITE_BASE ?? '/',
}))

/**
 * Appends ?v=<short git SHA> to static asset URLs in index.html so that
 * content-replacement invalidates the browser cache. Skips Vite-bundled
 * assets (already hashed in the filename) and absolute URLs (CDN/external).
 */
function cacheBustStaticAssets(): PluginOption {
  let shortSha: string
  try {
    shortSha = execSync('git rev-parse --short=7 HEAD', { encoding: 'utf8' }).trim()
  } catch {
    // Fallback for environments without git (rare; just no cache-bust)
    shortSha = String(Date.now())
  }

  const STATIC_PATH_RE = /^\/(?!assets\/|src\/)([^"'?#)\s]+\.(?:webp|jpg|jpeg|png|gif|svg|ico))$/i

  function applyCacheBust(html: string): string {
    return html.replace(
      /(<(?:img|source|link|script)[^>]*?\s(?:src|href))=(["'])([^"']+)\2/gi,
      (_match, attr, quote, url) => {
        if (STATIC_PATH_RE.test(url) && !url.includes('?v=')) {
          return `${attr}=${quote}${url}?v=${shortSha}${quote}`
        }
        return _match
      }
    )
  }

  return {
    name: 'cache-bust-static-assets',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return applyCacheBust(html)
      },
    },
  }
}
