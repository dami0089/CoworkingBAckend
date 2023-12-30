import Asistencias from "../models/Asistencias.js";
import Cliente from "../models/Cliente.js";
import Factura from "../models/Facturas.js";
import Planes from "../models/Planes.js";
import Usuario from "../models/Usuario.js";
import schedule, { scheduleJob } from "node-schedule";
import fs from "fs";
import Adicionales from "../models/Adicionales.js";
import Visitante from "../models/Visitantes.js";
import { enviarMensaje } from "../whatsappbot.js";
import { MercadoPagoConfig, Payment } from "mercadopago";
import dotenv from "dotenv";
import axios from "axios";
import moment from "moment/moment.js";
import { recordatorioVencimiento } from "../helpers/emails.js";

dotenv.config();

const obtenerClientes = async (req, res) => {
  const clientes = await Cliente.find();

  res.json(clientes);
};

const obtenerUsuario = async (req, res) => {
  const { id } = req.params;
  console.log("entro a obtener usuario" + id);

  const usuario = await Usuario.findById(id);
  console.log("Consulte el usuario, es este: " + usuario);

  if (!usuario) {
    const error = new Error("No existe el usuario");
    return res.status(403).json({ msg: error.message });
  }
  res.json(usuario);
};

const obtenerUsuariosProfile = async (req, res) => {
  const { id } = req.params;
  const usuarios = await Usuario.find({
    $or: [{ cliente: { $in: id } }],
  });

  res.json(usuarios);
};

const comprobarCliente = async (req, res) => {
  const { cuit } = req.body;
  console.log(cuit);

  const existeCliente = await Cliente.findOne({ cuit });
  console.log(existeCliente);

  if (existeCliente) {
    const error = new Error("Cliente ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  res.json({ msg: "ok" });
};

const nuevoCliente = async (req, res) => {
  const { planes, telefono, mailFactura, cuit } = req.body;
  const plan = await Planes.findById(planes);

  const clienteAlmacenado = await Cliente.findOne({ cuit: cuit });

  if (clienteAlmacenado) {
    const error = new Error("Cliente ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  const cliente = new Cliente(req.body);

  //agregamos el plan al Clientes
  cliente.planes = [];
  cliente.creador = req.usuario._id;
  cliente.nombrePlan = plan.nombre;
  cliente.celular = telefono;

  try {
    const clienteAlmacenado = await cliente.save();
    clienteAlmacenado.planes.push(plan._id);
    await clienteAlmacenado.save();

    const usuarioAlmacenado = await Usuario.findOne({ email: mailFactura });

    if (usuarioAlmacenado) {
      const error = new Error("El cliente ya tiene un usuario");
      return res.status(400).json({ msg: error.message });
    }

    const usuario = new Usuario();

    usuario.nombre = cliente.nombre;
    usuario.dni = cliente.cuit;
    usuario.nombrePlan = plan.nombre;
    usuario.email = cliente.mailFactura;
    usuario.celular = telefono;
    usuario.horasSala = plan.horasSalas;
    usuario.cliente = clienteAlmacenado._id;

    await usuario.save();
    res.json({ msg: "Cliente creado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const adicional = async (req, res) => {
  const adicional = new Adicionales(req.body);

  adicional.creador = req.usuario._id;

  try {
    const adicionalalmacenado = await adicional.save();
    await adicionalalmacenado.save();
    res.json(adicionalalmacenado);
  } catch (error) {
    console.log(error);
  }
};
const asistencias = async (req, res) => {
  const { id } = req.params;

  const usuario = await Usuario.findById(id);
  const asistencia = new Asistencias();
  let mensaje = "";

  asistencia.nombreUsuario = usuario.nombre;
  asistencia.usuario = id;
  console.log(usuario.plan);
  const hoy = new Date();
  const lunes = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate() - hoy.getDay() + 1
  );
  const viernes = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate() - hoy.getDay() + 5
  );

  const asistenciasSemana = await Asistencias.find({
    usuario: id,
    fecha: { $gte: lunes, $lte: hoy },
  });
  // Si el plan del usuario es "3 veces por semana", se comprueba cuántas veces ha asistido en la semana actual

  usuario.asistioHoy = true;

  try {
    if (usuario.nombrePlan === "3 Veces por semana") {
      if (asistenciasSemana.length === 0) {
        mensaje = "Primera vez en la semana para el usuario";
        const asistenciaAlmacenada = await asistencia.save();
        await usuario.save();
        res.json({
          tipo: 0,
          mensaje: mensaje,
          asistencia: asistenciaAlmacenada,
        });
        return;
      }
      if (asistenciasSemana.length === 1) {
        mensaje = "Segunda vez en la semana para el usuario";
        const asistenciaAlmacenada = await asistencia.save();
        await usuario.save();
        res.json({
          tipo: 0,
          mensaje: mensaje,
          asistencia: asistenciaAlmacenada,
        });
        return;
      }
      if (asistenciasSemana.length === 2) {
        mensaje = "Tercera y ultima vez en la semana para el usuario";
        const asistenciaAlmacenada = await asistencia.save();
        await usuario.save();
        res.json({
          tipo: 2,
          mensaje: mensaje,
          asistencia: asistenciaAlmacenada,
        });
        return;
      }
      if (asistenciasSemana.length >= 3) {
        res.json({
          tipo: 1,
          mensaje:
            "El cliente debera abonar un pase diario, ya supero las 3 veces",
        });
        return;
      }
    }

    const asistenciaAlmacenada = await asistencia.save();

    await usuario.save();

    res.json({ mensaje: mensaje, asistencia: asistenciaAlmacenada });
  } catch (error) {
    res.json(error);
  }
};

const obtenerAdicionales = async (req, res) => {
  const { id } = req.params;

  const adicionales = await Adicionales.find({
    $or: [{ cliente: { $in: id } }],
  });

  res.json({
    adicionales,
  });
};

const obtenerAsistencias = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const asistencias = await Asistencias.find({
    $or: [{ usuario: { $in: id } }],
  });

  // res.json({ cliente });

  //obtener las facturas del cliente
  // const facturas = await Factura.find().where("cliente").equals(cliente._id);

  res.json({
    asistencias,
  });
};

const obtenerCliente = async (req, res) => {
  const { id } = req.params;

  const cliente = await Cliente.findById(id);

  if (!cliente) {
    const error = new Error("Cliente no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // res.json({ cliente });

  //obtener las facturas del cliente
  // const facturas = await Factura.find().where("cliente").equals(cliente._id);

  res.json(cliente);
};

const obtenerPlan = async (req, res) => {
  const { id } = req.params;

  const plan = await Planes.findById(id);

  if (!plan) {
    const error = new Error("Plan no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // res.json({ cliente });

  //obtener las facturas del cliente
  // const facturas = await Factura.find().where("cliente").equals(cliente._id);

  res.json({
    plan,
  });
};

const buscarPlan = async (req, res) => {
  const planes = await Planes.find();

  res.json(planes);
};

const editarPlan = async (req, res) => {
  const { id } = req.params;
  console.log("editando");
  const plan = await Planes.findById(id);

  if (!plan) {
    const error = new Error("Plan No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  plan.nombre = req.body.nombre || plan.nombre;
  plan.descripcion = req.body.descripcion || plan.descripcion;
  plan.precio = req.body.precio || plan.precio;
  plan.horasSalas = req.body.horasSalas || plan.horasSalas;

  try {
    const planAlmacenado = await plan.save();
    res.json(planAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const editarAdicional = async (req, res) => {
  const { id } = req.params;

  const adicional = await Adicionales.findById(id);

  if (!adicional) {
    const error = new Error("Adicional No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  adicional.detalle = req.body.detalle || adicional.detalle;
  adicional.importe = req.body.importe || adicional.importe;
  adicional.notas = req.body.notas || adicional.notas;

  try {
    const adicionalAlmacenado = await adicional.save();
    res.json(adicionalAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const desactivarCliente = async (req, res) => {
  const { id } = req.params;
  const { isActivo } = req.body;

  const cliente = await Cliente.findById(id);
  const usuarios = await Usuario.find({
    $or: [{ cliente: { $in: id } }],
  });

  if (!cliente) {
    const error = new Error("Cliente No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (isActivo === true) {
    cliente.isActivo = false;
  } else {
    cliente.isActivo = true;
  }

  try {
    const clienteAlmacenado = await cliente.save();

    // Actualizar isActivo en cada objeto de usuario
    usuarios.forEach(async (usuario) => {
      if (isActivo === true) {
        usuario.isActivo = false;
      } else {
        usuario.isActivo = true;
      }
      await usuario.save();
    });

    res.json(clienteAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const editarCliente = async (req, res) => {
  const { id } = req.params;

  const cliente = await Cliente.findById(id);

  console.log(req.body);

  if (!cliente) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  cliente.tipo = req.body.tipo || cliente.tipo;
  cliente.nombre = req.body.nombre || cliente.nombre;
  cliente.mailFactura = req.body.mailFactura || cliente.mailFactura;
  cliente.domicilio = req.body.domicilio || cliente.domicilio;
  cliente.planes[0] = req.body.planes || cliente.planes;
  cliente.celular = req.body.celular || cliente.celular;
  cliente.cuit = req.body.cuit || cliente.cuit;
  cliente.fechaVencimiento =
    req.body.fechaVencimiento || cliente.fechaVencimiento;

  try {
    const usuarioAlmacenado = await cliente.save();
    console.log(usuarioAlmacenado);
    res.json(usuarioAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const agregarPlan = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);

  if (!cliente) {
    const error = new Error("Cliente no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  const { id } = req.body;
  const planes = await Planes.findOne({ id });

  if (!planes) {
    const error = new Error("Plan no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  cliente.planes.push(planes._id);
  await cliente.save();

  res.json({ msg: "Plan agregado correctamente", cliente });
};

const eliminarPlan = async (req, res) => {
  const { id } = req.params;
  const cliente = await Cliente.findById(id);
  console.log(cliente);
  if (!cliente) {
    const error = new Error("Cliente no encontrado");
    return res.status(404).json({ msg: error.message });
  }
  const { plan } = req.body;
  //esta bien se puede eliminar
  cliente.planes.pull([plan]);

  await cliente.save();

  res.json({ msg: "Plan eliminado correctamente" });
};

const cambiarAsistencias = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ asistioHoy: true });
    const promises = usuarios.map(async (usuario) => {
      usuario.asistioHoy = false;
      await usuario.save();
    });
    await Promise.all(promises);
  } catch (error) {
    console.error("Error al actualizar asistencias:", error);
  }
};

const cambiarAsist = async () => {
  try {
    const usuarios = await Usuario.find({
      asistioHoy: true,
      isActivo: true,
      nombrePlan: "3 Veces por semana",
    });
    const promises = usuarios.map(async (usuario) => {
      usuario.asistioHoy = false;
      await usuario.save();
    });
    await Promise.all(promises);
  } catch (error) {
    console.error("Error al actualizar asistencias:", error);
  }
};

// Cambiar asistencias todos los días a las 19 hs
schedule.scheduleJob("0 21 * * *", () => {
  cambiarAsist();
});

const editarAsistencia = async (req, res) => {
  const { id } = req.params;

  const asistencia = await Asistencias.findById(id);

  asistencia.fecha = req.body.fecha || asistencia.fecha;

  try {
    const asistenciaEditada = await asistencia.save();
    res.json(asistenciaEditada);
  } catch (error) {
    console.error("Error al actualizar asistencias:", error);
  }
};

const editarAsist = async () => {
  const { id } = req.params;

  const asistencia = await Asistencias.findById(id);

  asistencia.fecha = req.body.fecha || asistencia.fecha;

  try {
    const asistenciaEditada = await asistencia.save();
    res.json(asistenciaEditada);
  } catch (error) {
    console.error("Error al actualizar asistencias:", error);
  }
};

const eliminarAsistencia = async (req, res) => {
  const { id } = req.params;

  try {
    // Intentar encontrar y eliminar la asistencia por su ID
    const asistenciaEliminada = await Asistencias.findByIdAndRemove(id);

    // Si no se encuentra la asistencia, enviar un mensaje de error
    if (!asistenciaEliminada) {
      return res.status(404).json({ msg: "Asistencia no encontrada" });
    }

    // Enviar una confirmación de que la asistencia fue eliminada
    res.json({ msg: "Asistencia eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

const registrarVisitante = async (req, res) => {
  const registro = new Visitante(req.body);

  const cliente = await Cliente.findOne({ cuit: registro.dni });

  console.log(registro);
  console.log(cliente);

  if (!cliente) {
    const nuevoCliente = new Cliente();
    nuevoCliente.nombre = registro.nombre;
    nuevoCliente.cuit = registro.dni;
    nuevoCliente.mailFactura = registro.email;
    nuevoCliente.celular = registro.celular;
    await nuevoCliente.save();

    const mensajePase = `¡Hola ${registro.nombre}!
    Te damos la cordial bienvenida a *People Coworking*. Nos alegra que nos hayas elegido como tu espacio de trabajo. Para que tu experiencia aquí sea óptima, te brindamos las siguientes recomendaciones:
    1- *Conexión WiFi:* La contraseña es Coworking2019. Si necesitás mayor velocidad, conectate a las redes que indican 5G o 5.8 en su nombre. Si no las visualizás, es posible que tu dispositivo no sea compatible con dual band.
    2- *Refrigerios:* En el comedor disponés de café y té. Podés consumirlos cuando desees. Si querés comer, te pedimos que lo hagas en este espacio y evites hacerlo en las áreas de trabajo.
    3- *Bar:* Contamos con un bar donde ofrecemos desde snacks hasta almuerzos. Ruth estará disponible para atenderte.
    4- *Llamadas:* Disponemos de dos zonas de trabajo. El sector del fondo es de silencio, por lo que si tenés que hacer llamadas o charlas, utilizá el otro sector.
    
    Ante cualquier inquietud, Nadia y Damián en recepción están para asistirte. ¡Estamos a tu disposición!`;

    if (registro.motivo == "Pase diario") {
      await enviarMensaje(mensajePase, registro.celular);
    }
  }

  try {
    await registro.save();
    res.json({ msg: "OK" });
  } catch (error) {
    console.log(error);
  }
};

const obtenerVisitantes = async (req, res) => {
  const treintaDiasAtras = new Date();
  treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);

  const visitantes = await Visitante.find({
    fechaVisita: { $gte: treintaDiasAtras }, // Asumo que el campo que almacena la fecha se llama 'fecha'. Si tiene otro nombre, reemplaza 'fecha' por el nombre correcto.
  }).sort({ fechaVisita: -1 }); // Ordenar en orden descendente por fecha

  res.json(visitantes);
};

const obtenerTresVecesPorSemana = async (req, res) => {
  const clientes = await Cliente.find({ nombrePlan: "3 Veces por semana" });
  console.log(clientes);
  res.json(clientes);
};

const obtenerAsistenciasPorUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    // Comprobar si el usuario existe
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Buscar las asistencias asociadas con el usuario, ordenadas de la más reciente a la más antigua
    const asistenciasUsuario = await Asistencias.find({ usuario: id }).sort({
      fecha: -1,
    });

    // Enviar las asistencias encontradas
    res.json(asistenciasUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

const client = new MercadoPagoConfig({
  accessToken: process.env.TOKENMP,
  options: { timeout: 5000 },
});

const crearLinkPago = async (datosPago) => {
  const url = "https://api.mercadopago.com/checkout/preferences";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TOKENMP}`,
  };
  const body = {
    items: [
      {
        title: datosPago.descripcion,
        quantity: 1,
        unit_price: datosPago.monto,
      },
    ],
  };

  try {
    const response = await axios.post(url, body, { headers: headers });
    return response.data.init_point; // URL del link de pago
  } catch (error) {
    console.error("Error al crear el link de pago: ", error);
    return null;
  }
};

const formatearFecha = (fecha) => {
  return moment(fecha).format("DD/MM/YYYY");
};

const recordarVencimiento = async (req, res) => {
  const { id } = req.params;

  const cliente = await Cliente.findById(id);

  const plan = await Planes.findById(cliente.planes[0]);

  const precioFlotante = parseFloat(plan.precio);

  const datosPago = {
    descripcion: `Pago de membresia ${cliente.nombrePlan}`,
    monto: precioFlotante,
  };

  const enlace = await crearLinkPago(datosPago);

  const fechaFormateada = formatearFecha(cliente.fechaVencimiento);

  const datosMail = {
    email: cliente.mailFactura,
    nombre: cliente.nombre,
    vencimiento: fechaFormateada,
    nombrePlan: cliente.nombrePlan,
    linkPago: enlace,
  };

  await recordatorioVencimiento(datosMail);

  try {
    res.json({ msg: "Mail Enviado Correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const recordatorioVencimientoPorWhatsapp = async (req, res) => {
  const { id } = req.params;

  const cliente = await Cliente.findById(id);

  const plan = await Planes.findById(cliente.planes[0]);

  const precioFlotante = parseFloat(plan.precio);

  const datosPago = {
    descripcion: `Pago de membresia ${cliente.nombrePlan}`,
    monto: precioFlotante,
  };

  const enlace = await crearLinkPago(datosPago);

  const fechaFormateada = formatearFecha(cliente.fechaVencimiento);

  const mensaje = `Hola ${cliente.nombre}
  Este es un mensaje automatico para recordarte que tu membresia ${cliente.nombrePlan} vencio el ${fechaFormateada}. Podes abonar la misma por los medios de pago de siempre o por mercado pago al siguiente link: `;

  await enviarMensaje(mensaje, cliente.celular);
  await enviarMensaje(enlace, cliente.celular);

  try {
    res.json({ msg: "Whatsapp Enviado Correctamente" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export {
  obtenerClientes,
  nuevoCliente,
  obtenerCliente,
  editarCliente,
  buscarPlan,
  agregarPlan,
  eliminarPlan,
  comprobarCliente,
  obtenerUsuario,
  obtenerPlan,
  editarPlan,
  asistencias,
  desactivarCliente,
  obtenerUsuariosProfile,
  obtenerAsistencias,
  cambiarAsistencias,
  editarAsistencia,
  eliminarAsistencia,
  adicional,
  obtenerAdicionales,
  editarAdicional,
  registrarVisitante,
  obtenerVisitantes,
  obtenerTresVecesPorSemana,
  obtenerAsistenciasPorUsuario,
  recordarVencimiento,
  recordatorioVencimientoPorWhatsapp,
  // obtenerUsuariosCliente,
};
