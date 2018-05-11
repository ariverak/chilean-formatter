# chilean-formatter
# Installation
     - npm install --save chilean-formatter
# Usage
    - formatterRut("181303859") -> 18.130.385-9
    - cleanRut("18.130.385-9") -> 18130385  // without dv
    - cleanRut("18.130.385-9",true) -> 181303859 // with dv
    - validateRut("181303859")  -> true
    - numberToClp("1256500") -> $1.256.500 
    - numberToClp("1256500",',') -> $1,256,500  // with separator
    - getRutDv(18130385) -> 9
