const { Router } = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
//const bycript = require('bcryptjs');
const { validationResult, check } = require('express-validator');
const { validarJWT}= require('../middleware/validar-jwt');
const {validarRolAdmin } =require('../middleware/validar-rol-admin')


const router = Router();
 


// ingresar los datos 
router.post( '/', [validarJWT , validarRolAdmin],  [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])
    
  ], async function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) 
      return res.status(400).json({ mensaje: errors.array() });

       let estadoEquipo =new EstadoEquipo();
       estadoEquipo.nombre=req.body.nombre;
       estadoEquipo.estado=req.body.estado;
       estadoEquipo.fechaCreacion=new Date();
       estadoEquipo.fechaActualizacion=new Date();

       estadoEquipo=await estadoEquipo.save(); // inser into
       res.send(estadoEquipo);
      // console.log(usuario);
     
    } catch (error) {
      res.status(500).send('Error no  se puedueron guardar los datos ..')
     console.log(error);
    }
     

  });
// listar
router.get('/', [validarJWT, validarRolAdmin], async function(req, res){
    try{
        const estadoEquipos =await EstadoEquipo.find();
        res.send(estadoEquipos);
    }catch(error){
        console.log(error);
        res.status(500).send( 'Ocurrio un error');
    }
});

 // Actualizar
router.put( '/:estadoEquipoId', [validarJWT , validarRolAdmin],  [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])
  
], async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    return res.status(400).json({ mensaje: errors.array() });

     let estadoEquipo =await EstadoEquipo.findById(req.params.estadoEquipoId);
     if(!estadoEquipo){
      return res.status(400).send('Estado de quipo no existe');
     }
     estadoEquipo.nombre=req.body.nombre;
     estadoEquipo.estado=req.body.estado;
     estadoEquipo.fechaCreacion=new Date();
     estadoEquipo.fechaActualizacion=new Date();

     estadoEquipo=await estadoEquipo.save(); // inser into
     res.send(estadoEquipo);
    // console.log(usuario);
   
  } catch (error) {
   console.log(error);

    res.status(500).send('Error ..')
  }
   

});

//router.put('/')
//router.delete('/usuarioId')
module.exports = router;
