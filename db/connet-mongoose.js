const mongoose= require('mongoose');

const getConnetion =async()=>{

    try{
        const url='mongodb+srv://yorledysiud:lkfJikJHlIVlWdpA@cluster0.ilsatqt.mongodb.net/?retryWrites=true&w=majority'
        await mongoose.connect(url);
       
        console.log('Conexion exitosa');
     

    }catch(error){
       console.log(error);
    }
    
}

module.exports={
    getConnetion,
}