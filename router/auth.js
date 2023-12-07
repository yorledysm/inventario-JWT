// login

const { Router } = require("express");
const Usuario = require("../models/Usuario");
const bycript = require("bcryptjs");
const { validationResult, check } = require("express-validator");
const {generarJWT }= require('../helpers/jwt');
//const {generarJWT }= require('../helpers/jwt');
//const { model } = require("mongoose");

const router = Router();

router.post(
  "/",
  [
    check("email", "invalid.email").isEmail(),
    check("password", "invalid.password").not().isEmpty(),
  ],
  async function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() });
      }
      // vaidacion de  gmail
      const usuario = await Usuario.findOne({ email: req.body.email }); // select*
      if (!usuario) {
      //  return res.status(400).send('Existe email');

      return res.status(400).json({mensaje: 'Existe email'});
      }
      // validacion de la contrasela 
      const esIgual= bycript.compareSync(req.body.password, usuario.password);
      if(!esIgual){
        return res.status(400).json({mensaje: 'password invalido'});
      }

      // generar el token 
     const token =generarJWT(usuario);

      // const token= generarJWT(usuario);

      res.json({
        _id: usuario._id, nombre:usuario.nombre, 
        rol:usuario.rol, email:usuario.email, access_token:token

       // rol:usuario.rol, email:usuario.email, acess_token:token

      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error en el server " });
    }
  }
);

module.exports = router;
