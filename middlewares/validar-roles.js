const { request, response } = require('express');

const tieneRole = ( ...roles ) => {
    return (req = request, res= response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'verificando token...'
            })
        }

        if (!roles.includes( req.usuario.rol)) {
            return res.status(401).json({
                msg: `Necesita el rol ${ roles } para continuar`
            })

        }
        next();
    }
}


module.exports = {
    tieneRole
}