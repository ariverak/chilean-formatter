export function formatterRut(rut: string | number): string {
  const actual = rut.toString().replace(/^0+/, "");
  if (actual !== "" && actual.length > 1) {
    const sinPuntos = actual.replace(/\./g, "");
    const actualLimpio = sinPuntos.replace(/-/g, "");
    const inicio = actualLimpio.substring(0, actualLimpio.length - 1);
    let rutPuntos = "";
    let j = 1;
    for (let i = inicio.length - 1; i >= 0; i--) {
      const letra = !/^([0-9])*$/.test(inicio.charAt(i)) ? "" : inicio.charAt(i);
      rutPuntos = letra + rutPuntos;
      if (j % 3 === 0 && j <= inicio.length - 1) {
        rutPuntos = "." + rutPuntos;
      }
      j++;
    }
    const dv = actualLimpio.substring(actualLimpio.length - 1);
    return rutPuntos + "-" + dv;
  }
  return actual;
}

export function cleanRut(rut: string | number, withoutDv = false): string {
  const sinPuntos = rut.toString().replace(/\./g, "");
  const actualLimpio = sinPuntos.replace(/-/g, "");
  return withoutDv ? actualLimpio : actualLimpio.substring(0, actualLimpio.length - 1);
}

export function validateRut(rut: string | number): boolean {
  if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rut.toString())) {
    return false;
  }
  const limpio = cleanRut(rut, true);
  let t = Number.parseInt(limpio.slice(0, -1), 10);
  let m = 0;
  let s = 1;
  while (t > 0) {
    s = (s + (t % 10) * (9 - (m++ % 6))) % 11;
    t = Math.floor(t / 10);
  }
  const v = s > 0 ? "" + (s - 1) : "K";
  return v === limpio.slice(-1).toUpperCase();
}

export function numberToClp(monto: string | number, separator = ".", symbol = "$"): string {
  const cleanValue = monto.toString().replace(/\D/g, "");
  if (!cleanValue) return "";
  const valueConverted: string[] = cleanValue.split("").reverse();
  const length = valueConverted.length;
  const sobr = length % 3;
  let finalValue: string | undefined;
  const array: string[] = [];
  valueConverted.reduce((previus, current, index) => {
    if (index % 3 === 0) {
      array.push(previus.split("").reverse().join(""));
      return current;
    }
    return previus + current;
  });
  if (sobr) {
    const valSobr = valueConverted.reverse().slice(0, sobr);
    const point = length < 3 ? "" : separator;
    finalValue = valSobr.join("") + point;
  } else {
    array.push(valueConverted.reverse().slice(0, 3).join(""));
  }
  return `${symbol}${finalValue ? finalValue : ""}${array.reverse().join(separator)}`;
}

export function cleanClp(monto: string | number): string {
  return monto.toString().replace(/\D/g, "");
}

export function getRutDv(cleanRut: string | number): number | "K" {
  const newCleanRut = cleanRut.toString().split("").reverse().join("");
  let suma = 0;
  for (let i = 0, j = 2; i < newCleanRut.length; i++, j === 7 ? (j = 2) : j++) {
    suma += Number.parseInt(newCleanRut.charAt(i), 10) * j;
  }
  const n_dv = 11 - (suma % 11);
  return n_dv === 11 ? 0 : n_dv === 10 ? "K" : n_dv;
}
