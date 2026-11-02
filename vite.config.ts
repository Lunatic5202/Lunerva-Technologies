import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Social and canonical tags need an absolute URL. Set VITE_SITE_URL (e.g. https://example.com)
 * at build time and they are filled in; without it those tags are simply left out, never faked.
 */
function siteUrl(site: string) {
  const base = site.replace(/\/$/, '')
  return {
    name: 'lunevra-site-url',
    transformIndexHtml: (html: string) =>
      html.replace(/^[ \t]*%SITE_URL_LINE:(.*)%[ \t]*\n/gm, (_line, tag: string) =>
        base ? '    ' + tag.replaceAll('%SITE_URL%', base) + '\n' : '',
      ),
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  return { plugins: [react(), siteUrl(env.VITE_SITE_URL ?? '')] }
})
