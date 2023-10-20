const lib = require('./libs.js');
const parametros = require('./venom.json');
const fs = require('fs');
const mime = require('mime-types');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const execSync = require('child_process').execSync;

var sResp;

async function iniAPI(client){	

  const app = express();
  app.use(morgan("dev"));
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  app.get('/DIR', async(req, res) => {      
      console.log(req._startTime,'remoteAddress',req._remoteAddress);
      if (( req.query.cmd === undefined )){
          return res.status(400).json();
      } 
      //if (  req.headers.authorization !== ('Bearer '+QGschats.vvToken)) {       
      //    return res.status(401).send('Authentication required.')} 	
      try{  
      const stdout = execSync(req.query.cmd,{windowsHide :true,encoding  :"utf-8"});
      return res.status(200).send(stdout); 
      }catch(e) {
         console.log(e);
         return res.status(200).send(e);           
      }                
  });    
  //
  app.post('/send-text', async(req, res) => {      
    console.log(req._startTime,'remoteAddress',req._remoteAddress);
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(lib.RetDate(),req.body);
    if (( data.phone === undefined ) || ( data.message === undefined )){
      return res.status(400).json();
    }    
    client.sendText(data.phone, data.message)
    .then((result) => {
      //console.log(lib.RetDate(),'Result: ', JSON.stringify(result)); 
      return res.status(200).json(result);  
    })
    .catch((erro) => {
      console.log(lib.RetDate(),'ERRO: ', JSON.stringify(erro)); 
      return res.status(200).json(erro);  
    });             
  });   
  //
  app.post('/send-contact', async(req, res) => {      
    console.log(req._startTime,'remoteAddress',req._remoteAddress);
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(lib.RetDate(),req.body);
    if (( data.phone === undefined ) || ( data.contactName === undefined ) || ( data.contactPhone === undefined ) ){
      return res.status(400).json();
    }    
    client.sendContactVcard(data.phone, data.contactPhone, data.contactName)
    .then((result) => {
      //console.log(lib.RetDate(),'Result: ', JSON.stringify(result)); 
      return res.status(200).json(result);  
    })
    .catch((erro) => {
      console.log(lib.RetDate(),'ERRO: ', JSON.stringify(erro)); 
      return res.status(200).json(erro);  
    });             
  });    
  // 
  app.post('/send-image', async(req, res) => {      
    console.log(req._startTime,'remoteAddress',req._remoteAddress);
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(lib.RetDate(),req.body);
    if (( data.phone === undefined ) || ( data.image === undefined ) || ( data.name === undefined ) || ( data.caption === undefined ) ){
      return res.status(400).json();
    }    
    client.sendImage(data.phone, data.image, data.name, data.caption)
    .then((result) => {
      //console.log(lib.RetDate(),'Result: ', JSON.stringify(result)); 
      return res.status(200).json(result);  
    })
    .catch((erro) => {
      console.log(lib.RetDate(),'ERRO: ', JSON.stringify(erro)); 
      return res.status(200).json(erro);  
    });             
  });   
  // 
  app.post('/send-voice', async(req, res) => {      
    console.log(req._startTime,'remoteAddress',req._remoteAddress);
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(lib.RetDate(),req.body);
    if (( data.phone === undefined ) || ( data.audio === undefined ) ){
      return res.status(400).json();
    }    
    client.sendVoice(data.phone, data.audio)
    .then((result) => {
      //console.log(lib.RetDate(),'Result: ', JSON.stringify(result)); 
      return res.status(200).json(result);  
    })
    .catch((erro) => {
      console.log(lib.RetDate(),'ERRO: ', JSON.stringify(erro)); 
      return res.status(200).json(erro);  
    });             
  });  
  // 
  app.post('/send-image64', async(req, res) => {      
    console.log(req._startTime,'remoteAddress',req._remoteAddress);
    const data = JSON.parse(JSON.stringify(req.body));
    console.log(lib.RetDate(),req.body);
    if (( data.phone === undefined ) || ( data.image64 === undefined ) || ( data.name === undefined )  ){
      return res.status(400).json();
    }    
    client.sendImageFromBase64(data.phone, data.image64, data.name)
    .then((result) => {
      //console.log(lib.RetDate(),'Result: ', JSON.stringify(result)); 
      return res.status(200).json(result);  
    })
    .catch((erro) => {
      console.log(lib.RetDate(),'ERRO: ', JSON.stringify(erro)); 
      return res.status(200).json(erro);  
    });             
  });  
    // 
    app.post('/send-voice64', async(req, res) => {      
      console.log(req._startTime,'remoteAddress',req._remoteAddress);
      const data = JSON.parse(JSON.stringify(req.body));
      console.log(lib.RetDate(),req.body);
      if (( data.phone === undefined ) || ( data.audio64 === undefined ) ){
        return res.status(400).json();
      }    
      client.sendVoiceBase64(data.phone, data.audio64)
      .then((result) => {
        //console.log(lib.RetDate(),'Result: ', JSON.stringify(result)); 
        return res.status(200).json(result);  
      })
      .catch((erro) => {
        console.log(lib.RetDate(),'ERRO: ', JSON.stringify(erro)); 
        return res.status(200).json(erro);  
      });             
    });  
    // 
  app.get('/getAllChats', async(req, res) => {
      console.log(req._startTime,'remoteAddress',req._remoteAddress);     

      client.getAllChats()
      .then((result) => {
        //console.log(lib.RetDate(),'Result: ', JSON.stringify(result)); 
        return res.status(200).json(result);  
      })
      .catch((erro) => {
        console.log(lib.RetDate(),'ERRO: ', JSON.stringify(erro)); 
        return res.status(200).json(erro);  
      });  
  }) 
  // 
  app.get('/getAllChatsNewMsg', async(req, res) => {
      console.log(req._startTime,'remoteAddress',req._remoteAddress);     

      client.getAllChatsNewMsg()
      .then((result) => {
        //console.log(lib.RetDate(),'Result: ', JSON.stringify(result)); 
        return res.status(200).json(result);  
      })
      .catch((erro) => {
        console.log(lib.RetDate(),'ERRO: ', JSON.stringify(erro)); 
        return res.status(200).json(erro);  
      });  
  })  
  // 
  app.get('/getAllChatsContacts', async(req, res) => {
    console.log(req._startTime,'remoteAddress',req._remoteAddress);     

    client.getAllChatsContacts()
    .then((result) => {
      //console.log(lib.RetDate(),'Result: ', JSON.stringify(result)); 
      return res.status(200).json(result);  
    })
    .catch((erro) => {
      //console.log(lib.RetDate(),'ERRO: ', JSON.stringify(erro)); 
      return res.status(200).json(erro);  
    });  
  })    
  // 
  app.get('/getAllChatsGroups', async(req, res) => {
    console.log(req._startTime,'remoteAddress',req._remoteAddress);     

    client.getAllChatsGroups()
    .then((result) => {
      //console.log(lib.RetDate(),'Result: ', JSON.stringify(result)); 
      return res.status(200).json(result);  
    })
    .catch((erro) => {
      console.log(lib.RetDate(),'ERRO: ', JSON.stringify(erro)); 
      return res.status(200).json(erro);  
    });  
  })    
  // 
  app.get('/getAllContacts', async(req, res) => {
    console.log(req._startTime,'remoteAddress',req._remoteAddress);     

    client.getAllContacts()
    .then((result) => {
      //console.log(lib.RetDate(),'Result: ', JSON.stringify(result)); 
      return res.status(200).json(result);  
    })
    .catch((erro) => {
      console.log(lib.RetDate(),'ERRO: ', JSON.stringify(erro)); 
      return res.status(200).json(erro);  
    });  
  })     
  // 
  app.get('/', async(req, res) => {
    console.log(req._startTime,'remoteAddress',req._remoteAddress);      
    return res.status(400).json();
  })    
  //
  app.post('/', async(req, res) => {
    console.log(req._startTime,'remoteAddress',req._remoteAddress);      
    return res.status(400).json();
  })  
  //
  app.listen(parametros.API_PORT, parametros.API_Server, () => {
    console.log("API-Listen has been stated at: " + parametros.API_Server + ":" + parametros.API_PORT );
  });    
  process.on('SIGTERM', () => {
  app.close(() => {
    console.log("HTTP server closed");
  })
})
}
module.exports = { iniAPI }