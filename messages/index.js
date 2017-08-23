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



//Crear un conector de tipo chat para conectarse a un canal.

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale')); //Asignarle al bot la ubicacion del folder "locale"



//Enlazar el listening del bot al objeto tipo server creado anteriormente
server.post('/api/messages',connector.listen());


/*-------------------- Bloque de codigo para usar emulador local ------------*/








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
    function(session,args,next){

        //Validar si el usuario ya menciono su nombre. El nombre se graba la primera vez que se ejecuta el Bot.
        if (!session.userData.nombreUsuario) {

            //Iniciar nuevo dialogo menu principal
            session.beginDialog('/obtenerNombreUsuario');
            
            //Dialogo para dar bienvenida y preguntar el nombre
            //builder.Prompts.text(session,'Bienvenido!\n Con quien tenemos el gusto?');
        
        }
        else {
            //se agrego el parametro 'args' en la funcion para que no aparezca el error 'next function not found'.
            next();   
        }
    },
    function(session,results,next){

        if (!session.userData.nombreUsuario) {

            //obtener el nombre proporcionado por el usuario y mostrarlo
            session.userData.nombreUsuario = results.response;        
            session.send(`Hola ${session.userData.nombreUsuario}`);
        
        }
        
        //Iniciar nuevo dialogo menu principal
        session.beginDialog('/menuPrincipal');

    },
    function(session, results){

        //Guardar la opcion seleccionada en una variable a nivel sesion.
        session.userData.seleccionMenuPrincipal = results.response.entity;
        
        if (session.userData.seleccionMenuPrincipal == "Contactar a Rep. de Ventas o SC") {

            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 1; //Contactar rep. de ventas
                        
            //Iniciar dialogo contactar rep. de ventas
            session.beginDialog('/contactarRepVentas');

        }

        else if (session.userData.seleccionMenuPrincipal == "Consultar Permisos") {

            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 2; //Consultar permisos
                        
            //Iniciar nuevo dialogo consultar permisos
            session.beginDialog('/consultarPermisos');

        }

        else if (session.userData.seleccionMenuPrincipal == "Dia de Entrega de Contrarecibos-Cheques") {
            
            //builder.Prompts.text(session, `Usted seleccionó la opción: ${session.userData.seleccionMenuPrincipal}. `);

            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 3; //Consultar horario de contrarecibos
            
            //Iniciar nuevo dialogo consultar horario de contrarecibos
            session.beginDialog('/consultarHorarioContrarecibos');
                        
            //session.endDialog(); //menuPrincipal
        }
        
        else if (session.userData.seleccionMenuPrincipal == "Salir") {
            
            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 4; //salir
            
            //Iniciarlizar variables antes de cerrar la conversacion
            session.userData.nombreUsuario = "";

            session.endConversation(`Gracias, fue un placer atenderlo y que tenga un excelente día.`); //menuPrincipal

        }

        else{

            session.endDialog(`La respuesta no coincide con ninguna de las opciones del menu.`); //menuPrincipal
        }

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


bot.dialog('/obtenerNombreUsuario', [

    function(session,next){

        //Dialogo para dar bienvenida y preguntar el nombre
        builder.Prompts.text(session,'Bienvenido!\n Con quien tenemos el gusto?');
                    
    },
    function(session,results,next)
    {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('/menuPrincipal',[
    
    function (session) {
        
        builder.Prompts.choice(session,'En que podemos ayudarle el día de hoy?. (Seleccione una de las opciones haciendo clic sobre ella)','Contactar a Rep. de Ventas o SC|Consultar Permisos|Dia de Entrega de Contrarecibos-Cheques|Salir', { listStyle: builder.ListStyle.button });
    },
        
        
    function (session, results) {
        
        session.endDialogWithResult(results);


        /*
        //Guardar la opcion seleccionada en una variable a nivel sesion.
        session.userData.seleccionMenuPrincipal = results.response.entity;

        if (session.userData.seleccionMenuPrincipal == "Contactar a Rep. de Ventas") {

            //builder.Prompts.text(session, `Usted seleccionó la opcion: ${session.userData.seleccionMenuPrincipal} .`);

            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 1; //Contactar rep. de ventas

            //Iniciar nuevo dialogo contactar rep. ventas
            session.beginDialog('/contactarRepVentas');

            session.endDialog(); //menuPrincipal
        }
                
        else if (session.userData.seleccionMenuPrincipal == "Consultar Permisos") {

            //builder.Prompts.text(session, `Usted selecciono la opcion: ${session.userData.seleccionMenuPrincipal}. `);

            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 2; //Consultar permisos
            
            session.send(`Procesando su solicitud. Por favor espere un momento.....`);

            //Iniciar nuevo dialogo consultar permisos
            session.beginDialog('/consultarPermisos');
            
            
            //Iniciar nuevo dialogo continuar chat
            //session.beginDialog('/continuarChat');


            //session.endDialog(); //menuPrincipal

        }

        else if (session.userData.seleccionMenuPrincipal == "Consultar Horario de Contrarecibos") {
            
            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 3; //Consultar horario de contrarecibos
            
            builder.Prompts.text(session, `Usted seleccionó la opción: ${session.userData.seleccionMenuPrincipal}. `);
                        
            session.endDialog(); //menuPrincipal
        }
        
        else if (session.userData.seleccionMenuPrincipal == "Salir") {
            
            //Guardar la opcion seleccionada en una variable a nivel sesion.
            session.userData.opcionSeleccionada = 4; //salir
            
            session.endDialog(`Gracias, fue un placer atenderlo y que tenga un excelente día.`); //menuPrincipal

        }

        else{

            session.endDialog(`La respuesta no coincide con ninguna de las opciones del menu.`); //menuPrincipal
        }

        //session.userData.name = results.response;
        //builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
        
        */
    }

]);       


bot.dialog('/consultarPermisos',[
    
    function(session) {
        
        session.send(`A continuación se muestran los permisos otorgados a PTESSA. En cada opción podrá ver el tipo de permiso, la autoridad que lo otorga y una liga para poder ver una copia del permiso en formato pdf.`);

        //heroCard permiso de Acopio RME
        var heroCardAcopioRME = new builder.HeroCard(session)
            .title('Permiso de Acopio de Residuos de Manejo Especial (RME)')
            .subtitle('Otorgado por: Secretaría de Protección al Ambiente (SPA)')
            .text('Clic sobre la liga/botón para ver una copia del permiso en formato PDF')
            .images([
                builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/acopioRME.jpg')

            ])
            .buttons([
                builder.CardAction.openUrl(session,'https://pnet.ptesmx.com/permisos/acopiorme.pdf','Acopio RME')
            ]);

        var heroCardTransporteRME = new builder.HeroCard(session)
            .title('Permiso de Transporte de Residuos de Manejo Especial (RME)')
            .subtitle('Otorgado por: Secretaría de Protección al Ambiente (SPA)')
            .text('Clic sobre la liga/botón para ver una copia del permiso en formato PDF')
            .images([
                builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/transporteRME.jpg')

            ])
            .buttons([
                builder.CardAction.openUrl(session,'https://pnet.ptesmx.com/permisos/transporterme.pdf','Transporte RME')
            ]);

        var heroCardAcopioRP = new builder.HeroCard(session)
            .title('Permiso de Acopio de Residuos Peligrosos')
            .subtitle('Otorgado por: Secretaría del Medio Ambiente y Recursos Naturales (SEMARNAT)')
            .text('Clic sobre la liga/botón para ver una copia del permiso en formato PDF')
            .images([
                builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/acopioRP.jpg')

            ])
            .buttons([
                builder.CardAction.openUrl(session,'https://pnet.ptesmx.com/permisos/almacenamiento.pdf','Acopio RP')
            ]);

        var heroCardTransporteRP = new builder.HeroCard(session)
            .title('Permiso de Transporte de Residuos Peligrosos')
            .subtitle('Otorgado por: Secretaría del Medio Ambiente y Recursos Naturales (SEMARNAT)')
            .text('Clic sobre la liga/botón para ver una copia del permiso en formato PDF')
            .images([
                builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/transporteRP.jpg')

            ])
            .buttons([
                builder.CardAction.openUrl(session,'https://pnet.ptesmx.com/permisos/transporteresiduos.pdf','Transporte RP')
            ]);

        //Creamos un array de tarjetas
        var tarjetas = [heroCardAcopioRME, heroCardTransporteRME, heroCardAcopioRP, heroCardTransporteRP];

        //Adjuntamos la tarjeta al mensaje
        var msj = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(tarjetas);
        
        session.send(msj);


        //builder.Prompts.confirm(session,'Deseas realizar otra consulta?',{listStyle:builder.ListStyle.button});

        //Guardar la respuesta del usario en una variable a nivel sesion.
        //session.userData.continuarChat = results.response;
        
        //session.send(`Tu respuesta fue: ${session.userData.continuarChat}`);
        
        //Terminar dialogo
        session.endDialog();
    }
    
]);       


bot.dialog('/contactarRepVentas',[
    function(session){

        session.send(`A continuación le mostramos la información para contactar a nuestros representantes de ventas, o bien, a nuestro departamento de Servicio al Cliente.`);

        //ThumbnailCard Lucy
        var thumbnailCardLucy = new builder.ThumbnailCard(session)
            .title('Lucia Rodriguez')
            .subtitle('Correo: luciar@ptesinc.com')
            .text('Ciudad: Tijuana')
            .images([
                    builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/logo.png')
            
            ]);
    
        //ThumbnailCard CarlosD
        var thumbnailCardCarlos = new builder.ThumbnailCard(session)
            .title('Carlos DaCosta')
            .subtitle('Correo: carlosd@ptesinc.com')
            .text('Ciudad: Tijuana')
            .images([
                builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/logo.png')
        
            ]);
        

        //ThumbnailCard Israel
        var thumbnailCardIsrael = new builder.ThumbnailCard(session)
        .title('Israel Flores')
        .subtitle('Correo: israelf@ptesinc.com')
        .text('Ciudad: Tijuana')
        .images([
            builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/logo.png')
    
        ]);


        //ThumbnailCard Pablo
        var thumbnailCardPablo = new builder.ThumbnailCard(session)
        .title('Pablo Coria')
        .subtitle('Correo: pabloc@ptesinc.com')
        .text('Ciudad: Mexicali')
        .images([
            builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/logo.png')
    
        ]);
    

        //ThumbnailCard SC
        var thumbnailCardSC = new builder.ThumbnailCard(session)
        .title('Servicio al Cliente')
        .subtitle('Correo: sc@ptesinc.com')
        .text('Ciudad: Tijuana y Mexicali')
        .images([
            builder.CardImage.create(session,'http://www.ptesmx.com/download/botImages/logo.png')
    
        ]);
    


        //Creamos un array de tarjetas
        var tarjetas = [thumbnailCardLucy, thumbnailCardCarlos, thumbnailCardIsrael, thumbnailCardPablo, thumbnailCardSC];
        
        //Adjuntamos la tarjeta al mensaje
        var msj = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(tarjetas);
                
        session.send(msj);
        
        //Terminar dialogo
        session.endDialog();
        
    }

]);


bot.dialog('/consultarHorarioContrarecibos', [
    
    function(session, results){

        session.send(`El horario para la entrega de contrarecibos y cheques es: **Día Martes de 10 am - 1 pm** y **2pm a 4 pm**`);

        session.endDialog();

    }
    /*
    function(session, results){
        if (results.response){

            //Guardar la respuesta del usario en una variable a nivel sesion.
            session.userData.continuarChat = results.response;

            session.send(`Tu respuesta fue: ${session.userData.continuarChat}`);

            session.endDialog('Salida del dialogo con respuesta');
        }
        else {
            session.endDialog('Salida sin respuesta');
        }
    }
    */

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

