const venom = require('venom-bot');
const parametros = require('./venom.json');
const lib = require('./libs.js');
const api =  require('./api.js');
const mime = require('mime-types');
const fs = require("fs");

const initime = lib.RetDate() ;
console.log(initime);
var LastTime = initime;

// inicio
  
 console.log(process.env['USER']);
 inibot();    

async function inibot(){
  venom
  .create({
    session: parametros.SessionID, 
    // headless: 'old', 
    updatesLog: true, 
    autoClose: 300000,
    catchQR:  (base64Qrimg, asciiQR, attempts, urlCode) => {   

      let sQR = asciiQR.replace(/(?:\r\n|\r|\n)/g, '\\n');

      lib.SendHook(`{"type":"QRCODE","attempts":"${attempts}","urlCode":"${urlCode}","base64Qrimg":"${base64Qrimg}","asciiQR":"${sQR}"}`);

      console.log(asciiQR); 
      var matches = base64Qrimg.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }		

      fs.writeFile(parametros.SessionID+'_QR.txt', asciiQR, (err) => {        
        if (err) throw err;
      });	      
      
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      fs.writeFile(
        parametros.SessionID+'_QR.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err !== null) {
            console.log(err);
          }
        }
      );
    },
    statusFind: (statusSession, session) => {
      console.log('Status Session: ', statusSession); 
      console.log('Session name: ', session);
    }
  })
  .then((client) => {
     start(client);
     api.iniAPI(client);

     process.on('SIGINT', function() {
      client.close();
    });

  })
  .catch((erro) => {
    console.log(erro);
  });
}

//  
function start(client) {

  client.onAnyMessage(async (message) => {
    //console.log(lib.RetDate(), 'onAnyMessage',JSON.stringify( message ));
    //lib.SendHook(message);
  });  

  client.onMessage(async (message) => {
    console.log(lib.RetDate(), 'onMessage', JSON.stringify(message) );  
    lib.SendHook(message);
    //console.log(lib.RetDate(), 'onMessage',JSON.stringify( message ));    
    let sResp = '';

    if ( message.type === 'image' ||  message.type === 'audio' ||
     message.type === 'ptt' || message.type === 'document' ) {

       var filename;
       const buffer = await client.decryptFile(message);

       let filepath = parametros.pDown + lib.RetDateF() + "/" ;
       filename = filepath +message.id	;
        
       if (! fs.existsSync(filepath) ){
          fs.mkdirSync(filepath);      
       } 

       const wName = `${filename}.${mime.extension(message.mimetype)}`;
       fs.writeFile(wName, buffer, (err) => {
          if (err){
            console.error(err);
          }
          console.log(lib.RetDate(), 'decryptFile',wName);   
       });
    }
    
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      await client
      .sendText(message.from, 'Welcome Venom 🕷')
      .then((result) => {
          sResp = result ;      
      })
      .catch((erro) => {
        console.error(erro); 
        sResp = erro ;
      });  
      console.log(lib.RetDate(),JSON.stringify( sResp )); 
    }
    if (message.isMedia === true || message.isMMS === true) {
      console.log(lib.RetDate(), 'message.isMedia');    
    }

  });

  client.onAck((message) => {
    //console.log(lib.RetDate(), 'onAck',JSON.stringify( message ));
    console.log(lib.RetDate(), 'onAck', message.id.remote , message.id.id , message.ack );
    lib.SendHook(message);
  });    

  client.onStateChange((state) => {
    console.log(lib.RetDate(), 'onStateChange',JSON.stringify( state ));  
    lib.SendHook(`{"type":"onStateChange","state":"${state}"}`); 
  });  
  
  client.onAddedToGroup((chatEvent) => {
    console.log(lib.RetDate(), 'onAddedToGroup',JSON.stringify( chatEvent )); 
    lib.SendHook(chatEvent);     
  });

  let time = 0;
  client.onStreamChange((state) => {
    console.log(lib.RetDate(), 'onStreamChange',JSON.stringify( state )); 
    lib.SendHook(`{"type":"onStreamChange","state":"${state}"}`); 
    clearTimeout(time);
    if (state === 'DISCONNECTED' || state === 'SYNCING') {
      time = setTimeout(() => {
        client.close();
      }, 80000);
    }
  });

  client.onIncomingCall((call) => {
    console.log(lib.RetDate(), 'onIncomingCall',JSON.stringify( call )); 
    lib.SendHook(call); 
  });  

}