const fs = require("fs");
const axios = require('axios');
const parametros = require('./venom.json');

var HookOK = 1;

function RetDate (){
    const result = new Date(new Date()-3600*1000*3).toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    return result;
}

function RetDateF (){
  const result = new Date(new Date()-3600*1000*3).toISOString().slice(0,10).replace(/-/g,"");
  return result;
}  

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}  

function grava_eve( file , evento ){
  let jevento = JSON.stringify(evento);
  console.log('grava_eve',jevento);
  fs.writeFileSync(file + '.json', jevento);
}

function SendHook (message){
  if (parametros.Hook_URL == ''  || HookOK == 0 ){ return ; }
  console.log(RetDate(),"SendHook",message);

     axios.post(parametros.Hook_URL,
     message,
    {headers: {'Content-Type': 'application/json'} }).catch(async err => {
    if(err){
      console.log(JSON.stringify(err.cause));
      //HookOK = 0 ;
      return;  } 
    }); 
}

function apagadir ( caminho ){

  fs.readdir(caminho, (err, files) => {
    files.forEach(async file => {
      fs.unlinkSync(caminho+file);
    })}
  )}

module.exports = { RetDate, RetDateF, sleep, grava_eve, SendHook, apagadir}