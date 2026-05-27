# chilean-formatter

[![CI](https://github.com/ariverak/chilean-formatter/actions/workflows/ci.yml/badge.svg)](https://github.com/ariverak/chilean-formatter/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/chilean-formatter.svg)](https://www.npmjs.com/package/chilean-formatter)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Formateador y validador de **RUT** y **CLP** chilenos. TypeScript nativo, build dual ESM + CommonJS, **zero dependencies**, tipos incluidos.

## Instalación

```sh
pnpm add chilean-formatter
# o
npm install chilean-formatter
# o
yarn add chilean-formatter
```

Requiere **Node.js >= 18**.

## API

```ts
import {
  formatterRut,
  cleanRut,
  validateRut,
  numberToClp,
  cleanClp,
  getRutDv,
} from "chilean-formatter";

formatterRut("181303859");        // "18.130.385-9"
cleanRut("18.130.385-9");         // "18130385" (sin dv)
cleanRut("18.130.385-9", true);   // "181303859" (con dv)
validateRut("18.130.385-9");      // true
numberToClp("1256500");           // "$1.256.500"
numberToClp("1256500", ",");      // "$1,256,500"
numberToClp("1256500", ".", "CLP "); // "CLP 1.256.500"
cleanClp("$1.256.500");           // "1256500"
getRutDv(18130385);               // 9
getRutDv(12345670);               // "K"
```

Todas las funciones aceptan `string | number` como input principal.

## Migración v2 → v3

- **Sin cambios en la API pública.** Mismas firmas y mismos retornos.
- **Build dual**: ahora se publican `lib/index.js` (ESM), `lib/index.cjs` (CommonJS) y `lib/index.d.ts` (tipos).
- **Tipos TypeScript** incluidos automáticamente.
- **Fix**: `validateRut("12345670-k")` con minúscula ahora retorna `true` (antes retornaba `false` por comparación case-sensitive).
- **Node >= 18** requerido (antes no había `engines`).

## Desarrollo

```sh
pnpm install
pnpm test          # vitest
pnpm typecheck     # tsc --noEmit
pnpm build         # tsup → lib/
pnpm lint          # biome
```

## License

MIT © [ariverak](https://github.com/ariverak)
