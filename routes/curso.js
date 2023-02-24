const { Router } = require('express');
const { check } = require('express-validator');
const { postCurso, putCurso, deleteCurso, AsignacionCursos, getCursosAsignados} = require('../controllers/curso');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeCursoPorId } = require('../helpers/db-validators');

const router = Router();


router.get('/mostrar', [
    check('usuario', 'El id no es valido').isMongoId(),
    validarCampos
],getCursosAsignados);

router.post('/agregar', [
    validarJWT,
    tieneRole('MAESTRO_ROL'),
] ,postCurso);

router.put('/editar/:id', [
    validarJWT,
    tieneRole('ROL_MAESTRO'),
] ,putCurso);

router.delete('/eliminar/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCursoPorId ),
    tieneRole('ROL_MAESTRO'),
] ,deleteCurso);

router.put('/asignar', [
    validarJWT,
    check('cursos', 'No existe ese ID').isMongoId(),
    check('usuario', 'No existe ese ID').isMongoId(),
    validarCampos
] ,AsignacionCursos);

module.exports = router;