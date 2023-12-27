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
    origin: ["https://peopleapp.com.ar:5173"],
    // origin: ["http://127.0.0.1:5173"],
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
  console.log("Voy a activar el whats");
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });
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
      console.log(msg);
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

function extractNumberFromId(idStr) {
  const match = idStr.match(/549(\d+)@c\.us/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export { bot, enviarMensaje, consultarAutenticacion };
