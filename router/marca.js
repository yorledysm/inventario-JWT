const { Router } = require('express');
const Marca = require('../models/Marca');
//const bycript = require('bcryptjs');
const { validationResult, check } = require('express-validator');
const { validarJWT}= require('../middleware/validar-jwt');
const {validarRolAdmin } =require('../middleware/validar-rol-admin');
//const { param } = require('./inventario');

const router = Router();
 



router.post( '/', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])
    
  ], async function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) 
      return res.status(400).json({ mensaje: errors.array() });

       let marca =new Marca();
       marca.nombre=req.body.nombre;
       marca.estado=req.body.estado;
       marca.fechaCreacion=new Date();
       marca.fechaActualizacion=new Date();

       marca=await marca.save(); // inser into
       res.send(marca);
      // console.log(usuario);
     
    } catch (error) {
      res.status(500).send('Error no  se puedueron guardar los datos ..')
     console.log(error);
    }
     

  });

  router.get('/', [validarJWT, validarRolAdmin], async function(req, res){
    try{
        const marcas =await Marca.find();
        res.send(marcas);
    }catch(error){
        console.log(error);
        res.status(500).send( 'Ocurrio un error');
    }
});


  router.put('/:marcaId', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])
    
  ], async function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) 
      return res.status(400).json({ mensaje: errors.array() });

       let marca = await Marca.findById(req.params.marcaId);
       if(!marca){
        return res.status(400).send('La marca nos existe');
       }
       marca.nombre=req.body.nombre;
       marca.estado=req.body.estado;
       marca=await marca.save(); // inser into
       res.send(marca);
      // console.log(usuario);
     
    } catch (error) {
     console.log(error);
    }
     

  });


module.exports = router;