/**
 * vite plugin
 */

import eslint from '@rollup/plugin-eslint'
import typescript from '@rollup/plugin-typescript'
import reactRefresh from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import mdx from 'vite-plugin-mdx'

import configMockPlugin from './mock'
import configStyleImportPlugin from './styleImport'
import configVisualizerPlugin from './visualizer'

import { VITE_APP_ANALYZE, VITE_APP_COMPRESS_GZIP } from '../../constant'

export function createVitePlugins(viteEnv: string, isBuild: boolean) {
  const vitePlugins = [
    {
      ...eslint({
        include: 'src/**/*.+(js|jsx)'
      }),
      enforce: 'pre'
    },
    typescript(),
    reactRefresh(),
    configStyleImportPlugin(),
    mdx()
  ]

  // mock下开启
  viteEnv === 'mock' && vitePlugins.push(configMockPlugin(isBuild))

  // 包分析
  VITE_APP_ANALYZE && vitePlugins.push(configVisualizerPlugin())

  // 发布，打包
  if (VITE_APP_COMPRESS_GZIP && isBuild) {
    vitePlugins.push(viteCompression({ deleteOriginFile: true }))
  }

  return vitePlugins
}
