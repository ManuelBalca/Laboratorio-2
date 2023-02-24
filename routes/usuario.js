const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario, putPerfilUsuario, deletePerfilUsuario } = require('../controllers/usuario');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { esAlumno } = require('../middlewares/validar-alumno');
const role = require('../models/role');
const usuario = require('../models/usuario');

const router = Router();

router.get('/mostrar', getUsuarios);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    check('rol').custom( esRoleValido ),
    validarCampos,
] ,postUsuario);


router.put('/editar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom(  esRoleValido ),
    validarCampos
] ,putUsuario);

router.put('/editarPerfil/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom(  esRoleValido ),
    validarCampos,
    esAlumno
] ,putPerfilUsuario);

router.delete('/eliminarPerfil/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    esAlumno,
    validarCampos
] ,deletePerfilUsuario);

router.delete('/eliminar/:id', [
    validarJWT,
    tieneRole('ROL_MAESTRO'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteUsuario);

module.exports = router;