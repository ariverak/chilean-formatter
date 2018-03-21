# chilean-formatter
- #### Installation
     - npm install --save chilean-formatter
# USAGE
    - formatterRut("181303859") -> 18.130.385-9
    - cleanRut("18.130.385-9") -> 181303859 // with dv
    - cleanRut("18.130.385-9",true) -> 18130385 // without dv
    - validateRut("181303859")  -> true
    - numberToClp("1256500") -> $1.256.500 
    - getRutDv(18130385) -> 9
