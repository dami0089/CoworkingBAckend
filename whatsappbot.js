import pkg from "whatsapp-web.js";
const { Client, LegacySessionAuth, LocalAuth } = pkg;
import fs from "fs";
import qrcode from "qrcode-terminal";

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    // origin: ["http://34.235.146.116:5173"],
    origin: ["http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one", //Un identificador(Sugiero que no lo modifiques)
  }),
});

let autenticacion = 0;
//probando
const bot = async () => {
  client.on("ready", () => {
    console.log("Cliente Logeado");
    autenticacion = 1;
    io.emit("authentication-status", "authenticated"); // Emitir un evento al frontend para indicar que el cliente está autenticado.
  });

  client.on("qr", (qr) => {
    io.emit("qr", qr);
    autenticacion = 2;
    io.emit("authentication-status", "requires-authentication"); // Emitir un evento al frontend para indicar que se requiere autenticación.
  });

  client.on("message", async (msg) => {
    if (msg.from === "status@broadcast") {
    } else {
      const celu = await extractNumberFromId(msg.from);
      // console.log(msg);
      // await botDeRespuestas(msg, celu);
    }
  });

  client.initialize();
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

const enviarMensaje = async (mensaje, destinatario) => {
  const recipientId = "549" + destinatario + "@c.us";

  await client.sendMessage(recipientId, mensaje).catch((err) => {
    console.error("Error al enviar el mensaje:", err);
  });
};

const consultarAutenticacion = (req, res) => {
  res.json({ autenticacion });
};

// const botDeRespuestas = async (msg, celuChofer) => {
//   const chofer = await Choferes.findOne({ telefono: celuChofer });

//   if (chofer) {
//     const viajes = await Viajes.findOne({
//       chofer: chofer._id,
//       estadoDeViaje: {
//         $nin: [
//           "Terminado",
//           "Aceptar Equipos",
//           "Esperando Equipos",
//           "Por Asignar",
//         ],
//       },
//     });

//     if (viajes) {
//       await flujoChofer(chofer, viajes, msg);
//     } else {
//       // await msg.reply("Hola! Soy el servicio de atencion automatica de Logicsar! .");
//     }
//   }
// };

// const flujoChofer = async (chofer, viajes, msg) => {
//   //Entra con este mensaje
//   await client.sendMessage(
//     msg.from,
//     `Hola ${
//       chofer.nombre
//     }! Soy el servicio de atención automática de *Logicsar* 🤖!

// Actualmente tienes asignado el viaje ${viajes.numeroDeViaje} con origen en ${
//       viajes.nombreDomicilioOrigenCliente
//         ? viajes.nombreDomicilioOrigenCliente
//         : viajes.nombreDomicilioOrigenTerminal
//     } el ${viajes.fechaOrigen} a las ${viajes.horaOrigen} y destino en ${
//       viajes.nombreDomicilioDestinoTerminal
//         ? viajes.nombreDomicilioDestinoTerminal
//         : viajes.nombreDomicilioDestinoCliente
//     }.

// Podemos hacer lo siguiente:
// 1. Informar el estado del viaje 📋
// 2. Tengo un problema con el viaje y necesito ayuda ✋`
//   );
//   //Rspuesta si quiere cambiar estado
//   if (msg.body.toLowerCase() === "1") {
//     await msg.reply(`Excelente, el estado actual del viaje es ${viajes.estado}.\n
// Podemos cambiarlo a las siguientes opciones:\n
// a. Cargando
// b. En Transito
// c. Descargando
// d. Devolviendo Contenedor Vacio
// e. Terminado
// `);
//   }
//   if (msg.body.toLowerCase() === "a") {
//     viajes.estado = "Cargando";
//     await viajes.save();
//     await msg.reply(
//       "Hemos cambiado el estado a *Cargando*, gracias por el aviso!"
//     );

//     await msg.reply(
//       `Deseas ayuda en algo mas?\n 3.Volver a Inicio ⮐\n 2.Terminar`
//     );
//   }
//   if (msg.body.toLowerCase() === "b") {
//     viajes.estado = "Transito";
//     await viajes.save();

//     await msg.reply(
//       "Hemos cambiado el estado a *En Transito*, gracias por el aviso!"
//     );

//     await msg.reply(
//       `Deseas ayuda en algo mas?\n 3.Volver a Inicio ⮐\n 2.Terminar`
//     );
//   }
//   if (msg.body.toLowerCase() === "c") {
//     viajes.estado = "Descargando";
//     await viajes.save();

//     await msg.reply(
//       "Hemos cambiado el estado a *Descargando*, gracias por el aviso!"
//     );

//     await msg.reply(
//       `Deseas ayuda en algo mas?\n 3.Volver a Inicio ⮐\n 2.Terminar`
//     );
//   }
//   if (msg.body.toLowerCase() === "d") {
//     viajes.estado = "Devolviendo Vacio";
//     await viajes.save();

//     await msg.reply(
//       "Hemos cambiado el estado a *Devolviendo Contenedor Vacio*, gracias por el aviso!"
//     );

//     await msg.reply(
//       `Deseas ayuda en algo mas?\n 3.Volver a Inicio ⮐\n 4.Terminar`
//     );
//   }
//   if (msg.body.toLowerCase() === "e") {
//     viajes.estado = "Terminado";
//     await viajes.save();

//     await msg.reply(
//       "Hemos cambiado el estado a *Terminado*, gracias por el aviso!"
//     );

//     await msg.reply(
//       `Deseas ayuda en algo mas?\n 3.Volver a Inicio ⮐\n 4.Terminar`
//     );
//   }

//   if (msg.body.toLowerCase() === "3") {
//     await msg.reply(
//       `Hola ${
//         chofer.nombre
//       }! Soy el servicio de atención automática de *Logicsar* 🤖!

// Actualmente tienes asignado el viaje ${viajes.numeroDeViaje} con origen en ${
//         viajes.nombreDomicilioOrigenCliente
//           ? viajes.nombreDomicilioOrigenCliente
//           : viajes.nombreDomicilioOrigenTerminal
//       } el ${viajes.fechaOrigen} a las ${viajes.horaOrigen} y destino en ${
//         viajes.nombreDomicilioDestinoTerminal
//           ? viajes.nombreDomicilioDestinoTerminal
//           : viajes.nombreDomicilioDestinoCliente
//       }.

// Podemos hacer lo siguiente:
// 1. Informar el estado del viaje 📋
// 2. Tengo un problema con el viaje y necesito ayuda ✋`
//     );
//   }
//   if (msg.body.toLowerCase() === "4") {
//     await msg.reply(
//       `Gracias ${chofer.nombre} por comunicarte! Estamos a disposicion de lo que necesites.`
//     );
//     return;
//   }
// };

function extractNumberFromId(idStr) {
  const match = idStr.match(/549(\d+)@c\.us/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export { bot, enviarMensaje, consultarAutenticacion };
