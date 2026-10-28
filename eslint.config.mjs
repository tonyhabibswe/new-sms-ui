import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

// next/core-web-vitals already includes the React and React Hooks recommended
// rules, browser globals and the .next/out/build ignores.
export default defineConfig([...nextVitals, js.configs.recommended])
