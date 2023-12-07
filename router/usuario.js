const { Router } = require('express');
const Usuario = require('../models/Usuario');
const bycript = require('bcryptjs');
const { validationResult, check } = require('express-validator');
const { validarJWT}= require('../middleware/validar-jwt');
const {validarRolAdmin } =require('../middleware/validar-rol-admin')

const router = Router();
 



router.post( '/', [validarJWT , validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn(['Admin', 'Docente']),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])
    
  ], async function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) 
      return res.status(400).json({ mensaje: errors.array() });

      

      const existeUsuario =await Usuario.findOne({email:req.body.email}); // select*
       if(existeUsuario){
        return res.status(400).send('Email ya exite');
       }
       let usuario =new Usuario();
       usuario.nombre=req.body.nombre;
       usuario.email=req.body.email;
       //usuario.rol=req.body.rol;
       usuario.estado=req.body.estado;

       const salt = bycript.genSaltSync
       const password= bycript.hashSync(req.body.password,5); //salt
       usuario.password=password;
       usuario.rol=req.body.rol;
       usuario.fechaCreacion=new Date();
       usuario.fechaActualizacion=new Date();

       usuario=await usuario.save(); // inser into
       res.send(usuario);
      // console.log(usuario);
     
    } catch (error) {
      res.status(500).send('Error no  se puedueron guardar los datos ..')
     console.log(error);
    }
     

  });

router.get('/' ,[validarJWT , validarRolAdmin], async function(req, res){
    try{
        const usuarios =await Usuario.find();
        res.send(usuarios);
    }catch(error){
        console.log(error);
        res.status(500).send( 'Ocurrio un error');
    }
});



router.put( '/usuarioId', [validarJWT , validarRolAdmin], [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('email', 'invalid.email').isEmail(),
  check('password', 'invalid.password').not().isEmpty(),
  check('rol', 'invalid.rol').isIn(['Admin', 'Docente']),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])
  
], async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
    return res.status(400).json({ mensaje: errors.array() });

    

    
     let usuario =await Usuario.findById(res.params.usuarioId);
     if(!usuario){
      return res.status(400).send('Estado de equipo no existe')
     }
     usuario.nombre=req.body.nombre;
     usuario.email=req.body.email;
     //usuario.rol=req.body.rol;
     usuario.estado=req.body.estado;

     //const salt = bycript.genSaltSync
    // const password= bycript.hashSync(req.body.password,5); //salt
    // usuario.password=password;
     usuario.rol=req.body.rol;
     usuario.fechaCreacion=new Date();
     usuario.fechaActualizacion=new Date();

     usuario=await usuario.save(); // inser into
     res.send(usuario);
    // console.log(usuario);
   
  } catch (error) {
    res.status(500).send('Error no  se puedueron guardar los datos ..')
   console.log(error);
  }
   

});
//router.put('/')
//router.delete('/usuarioId')
module.exports = router;



