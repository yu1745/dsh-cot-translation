import { build } from 'esbuild'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const id = '@yu1745/dsh-cot-translation'
const host = { absWorkingDir: root, bundle: true, format: 'esm', platform: 'node', target: 'node22', packages: 'external' }
await build({ ...host, entryPoints: ['translator/src/index.ts'], outfile: 'translator/lib/index.js' })
await build({ ...host, entryPoints: ['controller/src/index.ts'], outfile: 'controller/lib/index.js', plugins: [{
  name: 'fork-translator',
  setup(api) {
    api.onResolve({ filter: /^@deepseek-ai\/dsh-experimental-translator$/ }, () => ({ path: '../../translator/lib/index.js', external: true }))
  },
}] })
const client = await build({
  absWorkingDir: root, entryPoints: ['controller/src/client/index.ts'], bundle: true,
  write: false, outfile: 'controller/lib/client.js', format: 'cjs', platform: 'browser', target: 'es2022',
  jsx: 'automatic', external: ['react', 'react/jsx-runtime', 'zod', '@deepseek-ai/dsh-client-store', '@deepseek-ai/dsh-client-ui-primitives'],
})
const script = client.outputFiles.find(file => file.path.endsWith('.js')).text
const css = client.outputFiles.find(file => file.path.endsWith('.css'))?.text ?? ''
await writeFile(new URL('./controller/lib/client.js', import.meta.url), `window.__ModuleLoader__.load({id:${JSON.stringify(id)},factory(require){\nconst module={exports:{}};\n${script}\nconst plugin=module.exports;\nreturn {...plugin,apply(ctx){\nctx.effect(()=>{const style=document.createElement('style');style.textContent=${JSON.stringify(css)};document.head.append(style);return ()=>style.remove();});\nreturn plugin.apply(ctx);\n}};\n}});\n`)
