/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-waterfall
-----------------------------------------------------------------------------*/
"use strict";



/*-------------------- Bloque de codigo para usar emulador local ------------*/

//Configuracion de restify y builder
var restify = require('restify');
var builder = require('botbuilder');
var path = require('path'); 


//Levantar el restify
var server = restify.createServer();
server.listen(process.env.port || process.env.port || 3978, function() {

    console.log('%s listening to %s',server.name,server.url);

});

//No te preocupes por estas credenciales por ahora, debido a que se trata de un server local.

var connector = new builder.ChatConnector(
    {
    appId: '',
    appPassword: ''
    }
);

/*-------------------- Bloque de codigo para usar emulador local ------------*/


//Crear un conector de tipo chat para conectarse a un canal.

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale')); //Asignarle al bot la ubicacion del folder "locale"



//Enlazar el listening del bot al objeto tipo server creado anteriormente
server.post('/api/messages',connector.listen());



/*-------------------- Bloque de codigo para usar el Azure Bot Service ------------*/
/*---------------------------------------------------------------------------------*/
/*

var builder = require("botbuilder"); //modulo para la creacion de objetos tipo bot
var botbuilder_azure = require("botbuilder-azure"); //modulo para la creacion de objetos tipo bot en azure
var path = require('path'); //modulo para el manejo de rutas de folders y archivos


var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});


//Crear un conector de tipo chat para conectarse a un canal.

var bot = new builder.UniversalBot(connector); //Crear bot
bot.localePath(path.join(__dirname, './locale')); //Asignarle al bot la ubicacion del folder "locale"

*/

/*---------------------------------------------------------------------------------*/
/*-------------------- Bloque de codigo para usar el Azure Bot Service ------------*/



bot.dialog('/', [
    function(session, results){

        //Dialogo para dar bienvenida y preguntar el nombre
        builder.Prompts.text(session,'Bienvenido!\n Con quien tenemos el gusto?');

    },
    function(session, results){

        //obtener el nombre proporcionado por el usuario y mostrarlo
        session.userData.nombre = results.response;        
        session.send(`Hola ${session.userData.nombre}`);
        
        //Iniciar nuevo dialogo menu principal
        session.beginDialog('/menuPrincipal');
    }

    /*
    function (session, results) {
        
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name + 
                    " you've been programming for " + session.userData.coding + 
                    " years and use " + session.userData.language + ".");
    }
    */
]);


bot.dialog('/menuPrincipal',[
    
    function (session) {
        
        builder.Prompts.choice(session,'En que podemos ayudarle el dia de hoy?','Contactar a Rep. de Ventas|Consultar Permisos|Consultar Horario de Contrarecibos|Salir', { listStyle: builder.ListStyle.button });
    },
        
        
    function (session, results) {
            
        //Guardar la opcion seleccionada en una variable a nivel sesion.
        session.userData.seleccionMenuPrincipal = results.response.entity;

        if (session.userData.seleccionMenuPrincipal == "Contactar a Rep. de Ventas") {

            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 1 //Contactar rep. de ventas

            builder.Prompts.text(session, `Usted selecciono la opcion: ${session.userData.seleccionMenuPrincipal} .`);
    
            session.endDialog();
        }
                
        else if (session.userData.seleccionMenuPrincipal == "Consultar Permisos") {

            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 2 //Consultar permisos
            
            //Iniciar nuevo dialogo consultar permisos
            session.beginDialog('/consultarPermisos');
            
            //builder.Prompts.text(session, `Usted selecciono la opcion: ${session.userData.seleccionMenuPrincipal}. `);

            session.endDialog(); //menuPrincipal

        }

        else if (session.userData.seleccionMenuPrincipal == "Consultar Horario de Contrarecibos") {
            
            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 3 //Consultar horario de contrarecibos
            
            builder.Prompts.text(session, `Usted selecciono la opcion: ${session.userData.seleccionMenuPrincipal}. `);
                        
            session.endDialog();
        }
        
        else if (session.userData.seleccionMenuPrincipal == "Salir") {
            
            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 4 //salir
            
            session.endDialog(`Gracias, fue un placer atenderlo y que tenga un excelente dia.`);

        }

        else{

            session.endDialog(`La respuesta no coincide con ninguna de las opciones del menu.`);
        }

        //session.userData.name = results.response;
        //builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
        
    }
]);       



bot.dialog('/consultarPermisos',[
    
     function(session) {
        
        session.send(`A continuacion se muestran los permitos otorgados a PTESSA. Favor de seleccionar cual de ellos desea consultar.`);

        //heroCard permiso de Acopio RME
        var heroCardAcopioRME = new builder.HeroCard(session)
            .title('Permiso de Acopio de Residuos de Manejo Especial (RME)')
            .subtitle('Otorgado por: Secretaria de Proteccion Ambiental (SPA)')
            .text('Clic sobre la imagen para obtener una copia del permiso en formato PDF')
            .images([
                builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/acopioRME.png')

            ])
            .buttons([
                builder.CardAction.openUrl(session,'https://pnet.ptesmx.com/permisos/acopiorme.pdf','Acopio RME')
            ]);

        var heroCardTransporteRME = new builder.HeroCard(session)
            .title('Permiso de Transporte de Residuos de Manejo Especial (RME)')
            .subtitle('Otorgado por: Secretaria de Proteccion Ambiental (SPA)')
            .text('Clic sobre la imagen para obtener una copia del permiso en formato PDF')
            .images([
                builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/transporteRME.jpg')

            ])
            .buttons([
                builder.CardAction.openUrl(session,'https://pnet.ptesmx.com/permisos/transporterme.pdf','Transporte RME')
            ]);

        var heroCardAcopioRP = new builder.HeroCard(session)
            .title('Permiso de Acopio de Residuos Peligrosos')
            .subtitle('Otorgado por: Secretaria de Proteccion Ambiental (SPA)')
            .text('Clic sobre la imagen para obtener una copia del permiso en formato PDF')
            .images([
                builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/acopioRP.jpg')

            ])
            .buttons([
                builder.CardAction.openUrl(session,'https://pnet.ptesmx.com/permisos/almacenamiento.pdf','Acopio RP')
            ]);


        //Creamos un array de tarjetas
        var tarjetas = [heroCardAcopioRME, heroCardTransporteRME, heroCardAcopioRP];

        //Adjuntamos la tarjeta al mensaje
        var msj = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(tarjetas);
        
        session.send(msj);

        //Terminar dialogo
        session.endDialog();
    }

]);       



/*
if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
*/

