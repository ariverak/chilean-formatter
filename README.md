# chilean-formatter

[![CI](https://github.com/ariverak/chilean-formatter/actions/workflows/ci.yml/badge.svg)](https://github.com/ariverak/chilean-formatter/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/chilean-formatter.svg)](https://www.npmjs.com/package/chilean-formatter)
[![npm downloads](https://img.shields.io/npm/dm/chilean-formatter.svg)](https://www.npmjs.com/package/chilean-formatter)
[![bundle size](https://img.shields.io/bundlephobia/minzip/chilean-formatter)](https://bundlephobia.com/package/chilean-formatter)
[![types](https://img.shields.io/npm/types/chilean-formatter.svg)](https://www.npmjs.com/package/chilean-formatter)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Formateadores y validadores chilenos: **RUT**, **CLP**, **teléfono**, **patente vehicular** y **decimal**.
> TypeScript nativo · Dual ESM + CJS · Zero dependencies · ~4.6 KB.

```ts
import {
  formatterRut, validateRut,
  numberToClp, formatDecimal,
  formatPhone, formatPatente,
} from "chilean-formatter";

formatterRut("181303859");        // "18.130.385-9"
validateRut("18.130.385-9");      // true
numberToClp(1256500);             // "$1.256.500"
formatDecimal(37854.23, 2);       // "37.854,23"   (UF / UTM)
formatPhone("912345678");         // "+56 9 1234 5678"
formatPatente("BBCD12");          // "BB·CD·12"
```

---

## Tabla de contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [API](#api)
  - [RUT](#rut)
  - [CLP](#clp)
  - [Decimal (UF / UTM)](#decimal-uf--utm)
  - [Teléfono](#teléfono)
  - [Patente vehicular](#patente-vehicular)
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
  formatterRut, cleanRut, validateRut, getRutDv, getRutType, maskRut, isProbablyRut,
  numberToClp, cleanClp,
  formatDecimal, cleanDecimal,
  formatPhone, validatePhone, cleanPhone,
  formatPatente, validatePatente, cleanPatente,
} from "chilean-formatter";
```

Vía CommonJS:

```js
const { formatterRut, numberToClp } = require("chilean-formatter");
```

Todas las funciones aceptan `string | number` y devuelven `string` (excepto las que validan o clasifican).

---

## API

### RUT

#### `formatterRut(rut)`

Formatea al estándar chileno `XX.XXX.XXX-Y`.

```ts
formatterRut("181303859");        // "18.130.385-9"
formatterRut(181303859);          // "18.130.385-9"
formatterRut("12345678K");        // "12.345.678-K"
formatterRut("0000181303859");    // "18.130.385-9"  (ceros a la izquierda removidos)
formatterRut("1");                // "1"             (input demasiado corto)
```

#### `cleanRut(rut, withoutDv?)`

Elimina puntos y guiones. Por defecto remueve el DV.

```ts
cleanRut("18.130.385-9");         // "18130385"
cleanRut("18.130.385-9", true);   // "181303859"
```

#### `validateRut(rut)`

Valida contra el DV (módulo 11). Acepta `k`/`K` indistintamente.

```ts
validateRut("18.130.385-9");      // true
validateRut("12345670-k");        // true
validateRut("18.130.385-0");      // false
validateRut("abc");               // false
```

#### `getRutDv(body)`

Calcula el DV (módulo 11).

```ts
getRutDv(18130385);               // 9
getRutDv(12345670);               // "K"
```

#### `getRutType(rut)`

Clasifica como `"persona"` o `"empresa"` según el umbral oficial del SII (≥ 50.000.000 → empresa).

```ts
getRutType("18.130.385-9");       // "persona"
getRutType("76.123.456-0");       // "empresa"
```

#### `maskRut(rut, visible?)`

Oculta los primeros dígitos del RUT para mostrar de forma parcial (privacidad / UI).

```ts
maskRut("18.130.385-9");          // "XX.XXX.385-9"  (5 chars visibles por default)
maskRut("18.130.385-9", 2);       // "XX.XXX.XXX-9"
```

#### `isProbablyRut(input)`

Heurística rápida (regex de formato, sin mod 11). Útil para detectar campos antes de validar.

```ts
isProbablyRut("18.130.385-9");    // true
isProbablyRut("hello");           // false
isProbablyRut(null);              // false
```

---

### CLP

#### `numberToClp(monto, separator?, symbol?)`

Formatea un monto como peso chileno.

```ts
numberToClp(1256500);                  // "$1.256.500"
numberToClp("1256500", ",");           // "$1,256,500"
numberToClp("1256500", ".", "CLP ");   // "CLP 1.256.500"
numberToClp("$1.256.500");             // "$1.256.500"  (limpia y reformatea)
numberToClp("");                       // ""
```

| Parámetro   | Tipo               | Default | Descripción                          |
| ----------- | ------------------ | ------- | ------------------------------------ |
| `monto`     | `string \| number` | —       | Cualquier valor; no-dígitos se descartan |
| `separator` | `string`           | `"."`   | Separador de miles                   |
| `symbol`    | `string`           | `"$"`   | Prefijo (símbolo de moneda)          |

#### `cleanClp(monto)`

Devuelve sólo dígitos.

```ts
cleanClp("$1.256.500");           // "1256500"
cleanClp("CLP 60.000");           // "60000"
```

---

### Decimal (UF / UTM)

Formato decimal chileno: `.` separa miles, `,` separa decimales. Ideal para valores como UF, UTM, tasas de interés o impuestos.

#### `formatDecimal(value, decimals?)`

```ts
formatDecimal(1234);              // "1.234"
formatDecimal(1234.56);           // "1.234,56"
formatDecimal(1234.5, 2);         // "1.234,50"     (decimales fijos)
formatDecimal(37854.23, 2);       // "37.854,23"   (típico UF)
formatDecimal(-1234.5);           // "-1.234,5"
formatDecimal("1.234,56");        // "1.234,56"    (parsea entrada CL)
formatDecimal("abc");             // ""
```

#### `cleanDecimal(value)`

Convierte un decimal en formato chileno a string parseable por JS.

```ts
cleanDecimal("1.234,56");         // "1234.56"
cleanDecimal("$ 1.234,56");       // "1234.56"
Number(cleanDecimal("37.854,23")); // 37854.23
```

---

### Teléfono

Plan numérico chileno: 9 dígitos después del código país `+56`. Primer dígito identifica el tipo:
- **9** → móvil
- **2** → fijo Santiago
- **3-7** → fijo regional

#### `formatPhone(phone)`

```ts
formatPhone("912345678");         // "+56 9 1234 5678"   (móvil)
formatPhone("223456789");         // "+56 2 2345 6789"   (fijo Santiago)
formatPhone("+56912345678");      // "+56 9 1234 5678"
formatPhone(912345678);           // "+56 9 1234 5678"
formatPhone("123");               // "123"               (inválido, retorna original)
```

#### `validatePhone(phone)`

```ts
validatePhone("+56 9 1234 5678"); // true
validatePhone("+56 2 2345 6789"); // true
validatePhone("12345");           // false
validatePhone("012345678");       // false
```

#### `cleanPhone(phone)`

Devuelve los 9 dígitos sin código país ni formato.

```ts
cleanPhone("+56 9 1234 5678");    // "912345678"
cleanPhone("9 1234-5678");        // "912345678"
```

---

### Patente vehicular

Soporta ambos formatos chilenos:
- **Antiguo** (hasta ~2007): 2 letras + 4 dígitos → `AB·12·34`
- **Nuevo** (desde 2007): 4 letras + 2 dígitos → `BB·CD·12`

#### `formatPatente(input, separator?)`

```ts
formatPatente("BBCD12");          // "BB·CD·12"   (default: middot)
formatPatente("AB1234");          // "AB·12·34"
formatPatente("BBCD12", "-");     // "BB-CD-12"
formatPatente("bb·cd·12");        // "BB·CD·12"   (reformatea + uppercase)
```

#### `validatePatente(input)`

```ts
validatePatente("BBCD12");        // true
validatePatente("AB1234");        // true
validatePatente("BB·CD·12");      // true
validatePatente("12BBCD");        // false
validatePatente("INVALID");       // false
```

> Nota: valida el patrón formal, no consulta la existencia del vehículo en el Registro Civil.

#### `cleanPatente(input)`

```ts
cleanPatente("bb·cd·12");         // "BBCD12"
cleanPatente("AB-1234");          // "AB1234"
```

---

## Migración v2 → v3

| Cambio | Detalle |
| --- | --- |
| **API pública v2** | Sin cambios. Mismas firmas y mismos retornos. |
| **Nuevas funciones** | `getRutType`, `maskRut`, `isProbablyRut`, `formatDecimal`, `cleanDecimal`, `formatPhone`, `validatePhone`, `cleanPhone`, `formatPatente`, `validatePatente`, `cleanPatente`. |
| **Build** | Dual ESM + CJS + tipos `.d.ts`. |
| **Tipos TS** | Incluidos automáticamente, sin `@types/*`. |
| **Bug fix** | `validateRut("RUT-k")` con minúscula ahora retorna `true`. |
| **Node** | Requiere `>= 18`. |
| **Bundle** | ~4.6 KB ESM, zero deps. Tree-shakeable. |

Para la mayoría de proyectos: `pnpm up chilean-formatter@^3`.

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
  index.ts          # re-exports públicos
  internal.ts       # helpers privados (computeDv, regex)
  rut.ts            # RUT formatters + validators + helpers
  clp.ts            # CLP formatters
  decimal.ts        # Decimal CL (UF / UTM)
  phone.ts          # teléfono chileno
  patente.ts        # patente vehicular
  index.test.ts     # 92 tests
tsup.config.ts      # build dual ESM/CJS + dts
biome.json          # lint + format
```

### Contribuir

Issues y PRs bienvenidos en [github.com/ariverak/chilean-formatter](https://github.com/ariverak/chilean-formatter).
Antes de abrir PR: `pnpm lint && pnpm typecheck && pnpm test`.

---

## License

[MIT](LICENSE) © [ariverak](https://github.com/ariverak)
