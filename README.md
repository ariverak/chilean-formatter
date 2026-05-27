# chilean-formatter

[![CI](https://github.com/ariverak/chilean-formatter/actions/workflows/ci.yml/badge.svg)](https://github.com/ariverak/chilean-formatter/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/chilean-formatter.svg)](https://www.npmjs.com/package/chilean-formatter)
[![npm downloads](https://img.shields.io/npm/dm/chilean-formatter.svg)](https://www.npmjs.com/package/chilean-formatter)
[![bundle size](https://img.shields.io/bundlephobia/minzip/chilean-formatter)](https://bundlephobia.com/package/chilean-formatter)
[![types](https://img.shields.io/npm/types/chilean-formatter.svg)](https://www.npmjs.com/package/chilean-formatter)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Formatea y valida **RUT** chileno y montos en **CLP** (Peso Chileno).
> TypeScript nativo · Dual ESM + CJS · Zero dependencies · ~1.7 KB.

```ts
import { formatterRut, validateRut, numberToClp } from "chilean-formatter";

formatterRut("181303859");   // "18.130.385-9"
validateRut("18.130.385-9"); // true
numberToClp(1256500);        // "$1.256.500"
```

---

## Tabla de contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [API](#api)
  - [`formatterRut`](#formatterrutrut)
  - [`cleanRut`](#cleanrutrut-withoutdv)
  - [`validateRut`](#validaterutrut)
  - [`getRutDv`](#getrutdvbody)
  - [`numberToClp`](#numbertoclpmonto-separator-symbol)
  - [`cleanClp`](#cleanclpmonto)
- [Migración v2 → v3](#migración-v2--v3)
- [Desarrollo](#desarrollo)
- [License](#license)

---

## Instalación

```sh
pnpm add chilean-formatter
# o
npm install chilean-formatter
# o
yarn add chilean-formatter
```

**Requisitos:** Node.js ≥ 18. ESM o CJS. Tipos TypeScript incluidos.

## Uso

```ts
import {
  formatterRut,
  cleanRut,
  validateRut,
  getRutDv,
  numberToClp,
  cleanClp,
} from "chilean-formatter";
```

Vía CommonJS:

```js
const { formatterRut, numberToClp } = require("chilean-formatter");
```

Todas las funciones aceptan `string | number` y devuelven `string` (excepto `validateRut → boolean` y `getRutDv → number | "K"`).

---

## API

### `formatterRut(rut)`

Formatea un RUT al estándar chileno `XX.XXX.XXX-Y`. Limpia puntos, guiones y ceros a la izquierda; reinserta puntos cada tres dígitos.

```ts
formatterRut("181303859");        // "18.130.385-9"
formatterRut("0000181303859");    // "18.130.385-9"
formatterRut(181303859);          // "18.130.385-9"
formatterRut("12345678K");        // "12.345.678-K"
formatterRut("1");                // "1"  (input demasiado corto, sin cambios)
```

### `cleanRut(rut, withoutDv?)`

Elimina puntos y guiones. Por defecto remueve también el dígito verificador.

```ts
cleanRut("18.130.385-9");         // "18130385"      (sin DV)
cleanRut("18.130.385-9", true);   // "181303859"     (con DV)
cleanRut("18.130.385-K", true);   // "18130385K"
```

### `validateRut(rut)`

Valida el RUT contra su dígito verificador (módulo 11). Acepta formato con o sin puntos, con `-`, y DV `k`/`K` en cualquier caso.

```ts
validateRut("18.130.385-9");      // true
validateRut("181303859");         // true
validateRut("12345670-k");        // true   (case-insensitive)
validateRut("18.130.385-0");      // false  (DV incorrecto)
validateRut("abc");               // false
validateRut("");                  // false
```

### `getRutDv(body)`

Calcula el dígito verificador (módulo 11) de un cuerpo de RUT.

```ts
getRutDv(18130385);               // 9
getRutDv(12345670);               // "K"
getRutDv(12345678);               // 5
```

### `numberToClp(monto, separator?, symbol?)`

Formatea un monto como Peso Chileno con separador de miles.

```ts
numberToClp(1256500);                  // "$1.256.500"
numberToClp("1256500");                // "$1.256.500"
numberToClp("1256500", ",");           // "$1,256,500"
numberToClp("1256500", ".", "CLP ");   // "CLP 1.256.500"
numberToClp("$1.256.500");             // "$1.256.500"  (limpia y reformatea)
numberToClp(0);                        // "$0"
numberToClp("");                       // ""
```

| Parámetro   | Tipo               | Default | Descripción                          |
| ----------- | ------------------ | ------- | ------------------------------------ |
| `monto`     | `string \| number` | —       | Cualquier valor; no-dígitos se descartan |
| `separator` | `string`           | `"."`   | Separador de miles                   |
| `symbol`    | `string`           | `"$"`   | Prefijo (símbolo de moneda)          |

### `cleanClp(monto)`

Devuelve sólo los dígitos.

```ts
cleanClp("$1.256.500");           // "1256500"
cleanClp("CLP 60.000");           // "60000"
cleanClp(1256500);                // "1256500"
```

---

## Migración v2 → v3

| Cambio | Detalle |
| --- | --- |
| **API pública** | Sin cambios. Mismas firmas y mismos retornos. |
| **Build** | Dual ESM (`lib/index.js`) + CJS (`lib/index.cjs`) + tipos (`lib/index.d.ts`). |
| **Tipos TS** | Incluidos automáticamente, no requiere `@types/*`. |
| **Bug fix** | `validateRut("RUT-k")` con minúscula ahora retorna `true` (antes `false`). |
| **Node** | Requiere `>= 18` (antes no había `engines`). |
| **Bundle** | ~1.7 KB ESM, zero deps. |

Para la mayoría de proyectos: `pnpm up chilean-formatter@^3` y listo.

---

## Desarrollo

```sh
pnpm install
pnpm test          # vitest run
pnpm typecheck     # tsc --noEmit
pnpm build         # tsup → lib/
pnpm lint          # biome check
pnpm format        # biome format --write
```

**Stack:** TypeScript 5 · tsup 8 · Vitest 4 · Biome 1 · pnpm 10.

### Estructura

```
src/
  index.ts        # API pública + helper privado computeDv
  index.test.ts   # 37 tests
tsup.config.ts    # build dual ESM/CJS + dts
tsconfig.json     # strict, target ES2022
biome.json        # lint + format
```

### Contribuir

Issues y PRs bienvenidos en [github.com/ariverak/chilean-formatter](https://github.com/ariverak/chilean-formatter).
Antes de abrir PR: `pnpm lint && pnpm typecheck && pnpm test`.

---

## License

[MIT](LICENSE) © [ariverak](https://github.com/ariverak)
