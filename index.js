const express =require('express');
const {getConnetion}= require('./db/connet-mongoose');
const cors=require('cors');
require('dotenv').config();

const app= express()
const host='0.0.0.0';
const port=process.env.PORT;

app.use(cors());

getConnetion();

app.use(express.json());

app.use('/usuario', require('./router/usuario'));
app.use('/inventario', require('./router/inventario'));
app.use('/marca', require('./router/marca'));
app.use('/estadoEquipo', require('./router/estadoEquipo'));
app.use('/tipoEquipo', require('./router/tipoEquipo'));
app.use('/auth', require('./router/auth'))



app.listen(port, host, () => {
    console.log(`Example app listening on port ${port}`)
  });