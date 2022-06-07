import esbuild from 'esbuild'

// const isDevMode=process.env.NODE_ENV!=='production'

esbuild.build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    // minify: true,
    sourcemap: true,
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    outdir: 'build',
}).catch(() => process.exit(1))