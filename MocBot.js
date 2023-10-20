const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
//
const LocalHook = '127.0.0.1';
const LocalHport = 6002 ;

//
InitHook();
//

function RetDate (){
    const result = new Date(new Date()-3600*1000*3).toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    return result;
}

function RetDateF (){
    const result = new Date(new Date()-3600*1000*3).toISOString().slice(0,10).replace(/-/g,"");
    return result;
}  

 //
  function InitHook (){
    const wapp = express();
    wapp.use(morgan("dev"));
    wapp.use(bodyParser.json({ limit: '100mb' }));
    wapp.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));  
  
    wapp.post('/', async(req, res) => {      
        console.log(req._startTime,'remoteAddress',req._remoteAddress);
        console.log(req.body);
        return res.status(200).json() ;  
    });
  
    wapp.get('/', async(req, res) => {
        console.log(req._startTime,'remoteAddress',req._remoteAddress);         
        console.log(req.body);
        return res.status(200).json();
    })
  
    wapp.listen(LocalHport,LocalHook, () => {
        console.log("MODBOT stated at: " + LocalHook + ":" + LocalHport);
    })  
  }
  
 