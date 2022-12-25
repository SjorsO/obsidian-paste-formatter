import esbuild from "esbuild";
import process from "process";
import builtins from 'builtin-modules'

const isProduction = process.argv[2] === 'production';

esbuild.build({
  entryPoints: ['src/Main.ts'],
  bundle: true,
  external: ['obsidian', 'electron', ...builtins],
  format: 'cjs',
  watch: !isProduction,
  target: 'es2016',
  logLevel: "info",
  sourcemap: isProduction ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
}).catch(() => process.exit(1));
