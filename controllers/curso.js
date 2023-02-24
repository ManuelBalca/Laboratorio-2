const { response, request } = require('express');
const Curso = require('../models/curso');


const getCursosAsignados = async (req, res) => {
    const { usuario } = req.body;

    try {
        const cursosAsignados = await Curso.find({ usuario: usuario });

        res.json(cursosAsignados);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error'
        });
    }
}

const AsignacionCursos = async (req = request, res = response) => {

    const { cursos, usuario } = req.body;

    //validacones para asignar cursos
    try {
        const cursosDB = await Curso.find({ _id: { $in: cursos } });

        const cursosUsuario = await Curso.find({
            usuario: usuario,
            _id: { $nin: cursos }
        });

        for (let i = 0; i < cursos.length; i++) {
            const curso = await Curso.findById(cursos[i]);
            if (curso.usuario.includes(usuario)) {
                return res.status(400).json({
                    msg: 'Este usuario ya esta asignado'
                });
            }
        }

        if (cursosUsuario.length + cursos.length > 3) {
            return res.status(400).json({
                msg: `ya está asignado en ${cursosUsuario.length} cursos, el limite son 3 cursos`
            });
        }
            //guardando el array en la base

        const data = {
            $addToSet: { usuario: usuario }
        }
        await Curso.updateMany({ _id: { $in: cursos } }, data);

        res.json({
            msg: `Se ha asignado al curso`,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error de backend'
        });
    }
}

const postCurso = async (req = request, res = response) => {

    const { nombreCurso } = req.body;
    const cursoGuardado = new Curso({ nombreCurso });

    await cursoGuardado.save();

    res.json({
        msg: 'Post Curso',
        cursoGuardado
    });

}

const putCurso = async (req = request, res = response) => {
    const { id } = req.params;
    const { nombreCurso, usuario } = req.body;

    try {
        const curso = await Curso.findById(id);

        curso.nombreCurso = nombreCurso;

        const index = curso.usuario.indexOf(usuario);

        if (index === -1) {
            curso.usuario.addToSet(usuario);
        } else {
            curso.usuario.splice(index, 1);
        }

        const cursoActualizado = await curso.save();

        res.json({
            msg: 'PUT editar curso',
            cursoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al actualizar el curso'
        });
    }
}

const deleteCurso = async (req = request, res = response) => {
    const { id } = req.params;

    const cursoEliminado = await Curso.findByIdAndUpdate(id, { estado: false, usuario: [] });

    res.json({
        msg: 'DELETE eliminar curso',
        cursoEliminado
    });
}

module.exports = {
    getCursosAsignados,
    AsignacionCursos,
    postCurso,
    putCurso,
    deleteCurso
}