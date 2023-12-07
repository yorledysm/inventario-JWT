const { Router } = require("express");
const Inventario = require("../models/Inventario");
const bycript = require("bcryptjs");
const { validationResult, check } = require("express-validator");
const { validarJWT}= require('../middleware/validar-jwt');
const {validarRolAdmin } =require('../middleware/validar-rol-admin')

const router = Router();
 

router.post( "/", [validarJWT , validarRolAdmin], [
    check("serial", "invalid.serial").not().isEmpty(),
    check("descripcion", "invalid.descripcion").not().isEmpty(),
    check("color", "invalid.color").not().isEmpty(),
   //check("fechaCompra", "invalid.fechaCompra").not().isEmpty(),
    check("precio", "invalid.precio").not().not().isEmpty().isFloat({min:0}),
    check("usuario", "invalid.usuario").not().isEmpty(),
    check("marca", "invalid.marca").not().isEmpty(),
    check("estadoEquipo", "invalid.estadoEquipo").not().isEmpty(),
    check("tipoEquipo", "invalid.tipoEquipo").not().isEmpty(),
  //  check("fechaCreaccion", "invalid.fechaCreaccion").not().isEmpty(),
  //  check("fechaActualizacion", "invalid.fechaActualizacion").not().isEmpty(),

  ],
  async function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({mensaje:errors.array()});

      }

      const existeInventarioPorSerial =await Inventario.findOne({serial: req.body.serial}); // select*
       if(existeInventarioPorSerial){
        return res.status(400).send(' El serial ya existe');
       }
       let inventario =new Inventario();
       inventario.serial=req.body.serial;
       inventario.descripcion=req.body.descripcion;
       inventario.color=req.body.color;
       inventario.fechaCompra=new Date();
       inventario.precio=req.body.precio;
       inventario.usuario=req.body.usuario._id;
       inventario.marca=req.body.marca._id;
       inventario.estadoEquipo=req.body.estadoEquipo._id;
      // inventario.estadoEquipo=req.body.estadoEquipo._id;
       inventario.tipoEquipo=req.body.tipoEquipo._id
       inventario.fechaCreaccion= new Date();
       inventario.fechaActualizacion=new Date();
      


     
       inventario=await inventario.save(); // inser into
       res.send(inventario);
      // console.log(usuario);
    } catch (error) {
      console.log(error);
      res.status(500).send('Ha ocurrido un error');
    }


  });

router.get('/', [validarJWT , validarRolAdmin], async function(req, res){
    try{
        const inventarios =await Inventario.find().populate([
            {
               path:'usuario', select: 'nombre de email estado'
            },
            {
                path:'marca', select: 'nombre estado'
            },
             {
               path:'estadoEquipo', select: 'nombre estado'
             },
             {
               path:'tipoEquipo', select:'nombre estado'
             }
        ]);
        res.send(inventarios);
    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
});


router.put( "/:inventarioId", [validarJWT , validarRolAdmin], [
  check("serial", "invalid.serial").not().isEmpty(),
  check("descripcion", "invalid.descripcion").not().isEmpty(),
  check("color", "invalid.color").not().isEmpty(),
 //check("fechaCompra", "invalid.fechaCompra").not().isEmpty(),
  check("precio", "invalid.precio").not().not().isEmpty().isFloat({min:0}),
  check("usuario", "invalid.usuario").not().isEmpty(),
  check("marca", "invalid.marca").not().isEmpty(),
  check("estadoEquipo", "invalid.estadoEquipo").not().isEmpty(),
  check("tipoEquipo", "invalid.tipoEquipo").not().isEmpty(),
//  check("fechaCreaccion", "invalid.fechaCreaccion").not().isEmpty(),
//  check("fechaActualizacion", "invalid.fechaActualizacion").not().isEmpty(),

],
async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({mensaje:errors.array()});

    }

    
     let inventario = await Inventario.findById(req.params.inventarioId);
     if(!inventario){
      return res.status(400).send('Extado de equipo no existe');
     }
     inventario.serial=req.body.serial;
     inventario.descripcion=req.body.descripcion;
     inventario.color=req.body.color;
    // inventario.fechaCompra=new Date();
     inventario.precio=req.body.precio;
     inventario.usuario=req.body.usuario._id;
     inventario.marca=req.body.marca._id;
     inventario.estadoEquipo=req.body.estadoEquipo._id;
    // inventario.estadoEquipo=req.body.estadoEquipo._id;
     inventario.tipoEquipo=req.body.tipoEquipo._id
     //inventario.fechaCreaccion= new Date();
    // inventario.fechaActualizacion=new Date();
    


   
     inventario=await inventario.save(); // inser into
     res.send(inventario);
    // console.log(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).send('Ha ocurrido un error');
  }


});
//router.put('/')
//router.delete('/usuarioId')
module.exports = router;
