import nodemailer from "nodemailer";

// TODO: mejorar los html de los mail que llegan a los clientes.

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const hemail = process.env.EMAIL;
  const hpass = process.env.PASSWORD;
  const host = process.env.HOST;
  const port = process.env.EMAIL_PORT;

  const transport = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: hemail,
      pass: hpass,
    },
  });

  //informacion del email

  const info = await transport.sendMail({
    from: '"People Coworking - Bienvenid@!" <info@peopleco.com.ar>',
    to: email,
    subject: "Alta de cuenta",
    text: "Verifica tu cuenta en People Coworking",
    html: `
        <p>Hola ${nombre}, bienvenid@ a People Coworking</p>
        <p>Hemos creado tu cuenta para que puedas gestionar tus reservas de sala de reunion, ver facturas, abonar y mucho mas. Solo debes configurar una contraseña y puedes hacerlo en el siguiente enlace: <a href='${process.env.FRONTEND_URL}/crear-password/${token}'>Configurar Pass</a></p>

        <p>Si no acabas de adquirir una membresia en People Coworking, puedes ignorar este mensaje.</p>

        <p>Que tengas un gran dia!</p>
        <p>Equipo People Coworking</p>
    `,
  });
};

export const emailAdmin = async (datos) => {
  const { email, nombre, token } = datos;

  const hemail = process.env.EMAIL;
  const hpass = process.env.PASSWORD;
  const host = process.env.HOST;
  const port = process.env.EMAIL_PORT;

  const transport = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: hemail,
      pass: hpass,
    },
  });

  //informacion del email

  const info = await transport.sendMail({
    from: '"People Coworking" <info@peopleco.com.ar>',
    to: email,
    subject: "Alta de cuenta",
    text: "Verifica tu cuenta en People Coworking",
    html: `
        <p>Hola ${nombre}</p>
        <p>Hemos creado tu cuenta para gestiones administrativas del espacio. Solo debes configurar una contraseña y puedes hacerlo en el siguiente enlace: <a href='${process.env.FRONTEND_URL}/crear-password/${token}'>Configurar Pass</a></p>

        <p>Si no acabas de adquirir una membresia en People Coworking, puedes ignorar este mensaje.</p>

        <p>Que tengas un gran dia!</p>
        <p>Equipo People Coworking</p>
    `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const hemail = process.env.EMAIL;
  const hpass = process.env.PASSWORD;
  const host = process.env.HOST;
  const port = process.env.EMAIL_PORT;

  const transport = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: hemail,
      pass: hpass,
    },
  });

  //informacion del email

  const info = await transport.sendMail({
    from: '"People Coworking" <info@peopleco.com.ar>',
    to: email,
    subject: "Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `
        <p>Hola ${nombre} has solicitado reestablecer tu password en nuestro sistema</p>
        <p>sigue siguiente enlace para generar un nuevo password: <a href='${process.env.FRONTEND_URL}/olvide-password/${token}'>Reestablecer Password</a></p>

        <p>Si tu no solicitaste este cambio, puedes ignorar el mensaje</p>

       
    `,
  });
};

export const emailReservaSala = async (datos) => {
  const { email, nombre, sala, fecha, horaInicio, horaFin } = datos;

  const hemail = process.env.EMAIL;
  const hpass = process.env.PASSWORD;
  const host = process.env.HOST;
  const port = process.env.EMAIL_PORT;

  const transport = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: hemail,
      pass: hpass,
    },
  });

  //informacion del email

  const info = await transport.sendMail({
    from: '"People Coworking" <info@peopleco.com.ar>',
    to: email,
    subject: `Reserva Creada en ${sala}`,
    text: `Reserva Creada en ${sala}`,
    html: `
        <p>Hola ${nombre}</p>
        <p>A continuacion te compartimos los detalles de tu reserva:</p>
        <p>\nFecha: ${fecha}</p>
        <p>\nHora Inicio: ${horaInicio}</p>
        <p>\nHora Fin: ${horaFin}</p>

        <p>Recorda que si necesitas cancelar la misma podras hacerlo desde nuestra web, o bien informando a nuestro personal.</p>

       
    `,
  });
};

export const recordatorioVencimiento = async (datos) => {
  const { email, nombre, vencimiento, nombrePlan, linkPago } = datos;

  const hemail = process.env.EMAIL;
  const hpass = process.env.PASSWORD;
  const host = process.env.HOST;
  const port = process.env.EMAIL_PORT;

  const transport = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: hemail,
      pass: hpass,
    },
  });

  //informacion del email

  const info = await transport.sendMail({
    from: '"People Coworking - Bienvenid@!" <info@peopleco.com.ar>',
    to: email,
    cc: "info@peopleco.com.ar",
    subject: "Recordatorio de Pago",
    text: "Recordatorio de Pago - People Coworking",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hola ${nombre}!</h2>
        <p>Te recordamos que tu ${nombrePlan} venció el día ${vencimiento}. A continuación, te compartimos un enlace para realizar el pago a través de Mercado Pago. También puedes optar por transferencia bancaria (datos adjuntos), pagar en efectivo o con tarjeta en la recepción.</p>
  
        <a href="${linkPago}" target="_blank" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #009ee3; color: #ffffff; text-decoration: none; border-radius: 5px;">
          <img src="https://http2.mlstatic.com/frontend-assets/banking-home-landing/logo-mercadopago.jpg" alt="Mercado Pago" style="vertical-align: middle; height: 30px; margin-right: 10px;">
          Pagar con Mercado Pago
        </a>
  
        <p style="margin-top: 30px;">Aguardamos tu respuesta a la brevedad.</p>
        <p>Que tengas un gran día!</p>
        <p>Equipo People Coworking</p>
      </div>
    `,
    attachments: [
      {
        filename: "datos-bancarios.pdf", // Cambia esto por el nombre real del archivo
        path: "helpers/datos-bancarios.pdf", // Cambia esto por la ruta real del archivo
      },
    ],
  });
};
