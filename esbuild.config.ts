import esbuild from 'esbuild'
import path from 'path'
import { copyFile } from 'fs'

// const isDevMode=process.env.NODE_ENV!=='production'

esbuild
  .build({
    entryPoints: ['src/client/index.tsx'],
    bundle: true,
    // minify: true,
    sourcemap: true,
    // target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    outdir: 'build',
    watch: {
      onRebuild(error) {
        if (error) {
          console.error('build error: ', error)
        } else {
          copyFile(
            path.join(__dirname, 'public/index.html'),
            path.join(__dirname, 'build/index.html'),
            err => {
              if (err) {
                console.error('copy file error: ', err)
              } else {
                console.log('Build Done')
              }
            },
          )
        }
      },
    },
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
