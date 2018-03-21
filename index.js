export function formatterRut(rut) {
    var actual = rut.toString().replace(/^0+/, "");
    if (actual != '' && actual.length > 1) {
        var sinPuntos = actual.replace(/\./g, "");
        var actualLimpio = sinPuntos.replace(/-/g, "");
        var inicio = actualLimpio.substring(0, actualLimpio.length - 1);
        var rutPuntos = "";
        var i = 0;
        var j = 1;
        for (i = inicio.length - 1; i >= 0; i--) {
            var letra = !/^([0-9])*$/.test(inicio.charAt(i)) ? '' : inicio.charAt(i);
            rutPuntos = letra + rutPuntos;
            if (j % 3 == 0 && j <= inicio.length - 1) {
                rutPuntos = "." + rutPuntos;
            }
            j++;
        }
        var dv = actualLimpio.substring(actualLimpio.length - 1);
        rutPuntos = rutPuntos + "-" + dv;
    }
    return rutPuntos;
}

export function cleanRut(rut,withoutDv = false){
    var sinPuntos = rut.toString().replace(/\./g, "");
    var actualLimpio = sinPuntos.replace(/-/g, "");
    return withDv ? actualLimpio : actualLimpio.substring(0, actualLimpio.length - 1);
}

export function validateRut(rut){
        if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rut.toString())) {
          return false
        }
        rut = cleanRutWithDv(rut)
        var t = parseInt(rut.slice(0, -1), 10)
        var m = 0
        var s = 1
        while (t > 0) {
          s = (s + (t % 10) * (9 - m++ % 6)) % 11
          t = Math.floor(t / 10)
        }
        var v = s > 0 ? '' + (s - 1) : 'K'
        return v === rut.slice(-1)
}

export function numberToClp(monto) {
    let valueConverted = monto.toString().split("").reverse()
    const length = valueConverted.length;
    const divs = length / 3;
    const sobr = length % 3;
    let finalValue;
    let array = [];
    valueConverted.reduce((previus,current,index)=>{
      if(index % 3 == 0){
        array.push(previus.split("").reverse().join(""))
        return current
      }
      return previus+current 
    })
    if(sobr){
      let valSobr = valueConverted.reverse().slice(0,sobr)
      let point = length < 3 ? '' : '.'
      finalValue = valSobr.join('')+ point
    }else{
      array.push(monto.toString().split('').slice(0,3).join(''))
    }
    return `$${finalValue?finalValue:''}${array.reverse().join('.')}`
}
export function getRutDv(cleanRut) {
    let newCleanRut = cleanRut.toString().split("").reverse().join("");
    let suma = 0;
    for(let i=0,j=2; i < newCleanRut.length; i++, ((j===7) ? j=2 : j++)) {
        suma += (parseInt(newCleanRut.charAt(i),10) * j); 
    }
    let n_dv = 11 - (suma % 11);
    return ((n_dv === 11) ? 0 : ((n_dv === 10) ? "K" : n_dv));
}