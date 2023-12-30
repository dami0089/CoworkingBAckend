import Cliente from "../models/Cliente.js";
import Proveedor from "../models/Proveedor.js";
import Movimientos from "../models/Movimientos.js";
import moment from "moment/moment.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const Afip = require("@afipsdk/afip.js");

const afip = new Afip({
  CUIT: 20342955119,
  res_folder: "../backend/afip/", // Asegúrate de que esta ruta sea correcta
  cert: "sistema-nuevo.pem", // Asegúrate de que esta ruta sea correcta
  key: "privateKey.key", // Asegúrate de que esta ruta sea correcta
  production: true,
});

const pruebaAfip = async () => {
  try {
    const details = await afip.RegisterScopeThirteen.getTaxpayerDetails(
      30716895080
    );
    console.log("Detalles del CUIT:", details);
  } catch (error) {
    console.error("Error al obtener detalles del CUIT:", error);
  }
  // afip.RegisterScopeFive.getTaxpayerDetails(20342955119)
  //   .then((response) => {
  //     console.log("Detalles del CUIT:", response);
  //   })
  //   .catch((err) => {
  //     console.error("Error al obtener detalles del CUIT:", err.message);
  //     console.error(err);
  //   });

  // afip
  //   .GetServiceTA("wsfe")
  //   .then((response) => {
  //     console.log("Token de Acceso:", response);
  //   })
  //   .catch((err) => {
  //     console.error("Error obteniendo el Token de Acceso:", err);
  //   });
};

const obtenerMovimientos = async (req, res) => {
  const { entidad } = req.body; // Recibe la entidad del body

  // Ajustar manualmente la hora a la zona horaria de Argentina (GMT-3)
  // Nota: Esto puede no ser preciso durante el horario de verano
  const inicioMes = moment().utcOffset("-03:00").startOf("month").toDate();
  const finMes = moment().utcOffset("-03:00").endOf("month").toDate();

  try {
    const movimientos = await Movimientos.find({
      entidad: entidad,
      fecha: {
        $gte: inicioMes,
        $lte: finMes,
      },
    });

    res.json(movimientos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los movimientos" });
  }
};

const obtenerMovimientosPorMesYAno = async (req, res) => {
  const { entidad, mes, ano } = req.body.info; // Extrae los valores de req.body.info

  // Asegurarse de que el mes tenga dos dígitos
  const mesFormateado = mes.padStart(2, "0");

  // Convertir mes y año a un rango de fechas
  const inicioMes = moment(`${ano}-${mesFormateado}`, "YYYY-MM")
    .startOf("month")
    .toDate();
  const finMes = moment(`${ano}-${mesFormateado}`, "YYYY-MM")
    .endOf("month")
    .toDate();

  try {
    const movimientos = await Movimientos.find({
      entidad: entidad,
      fecha: {
        $gte: inicioMes,
        $lte: finMes,
      },
    });

    res.json(movimientos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los movimientos" });
  }
};

const nuevoMovimiento = async (req, res) => {
  const movimiento = new Movimientos(req.body);

  console.log(req.body);

  if (req.body.hasOwnProperty("cliente")) {
    const { cliente } = req.body;
    const clienteBase = await Cliente.findById(cliente);
    movimiento.cliente = clienteBase._id;
    movimiento.nombreCliente = clienteBase.nombre;
  } else {
    const { proveedor } = req.body;
    const proveedorBase = await Proveedor.findById(proveedor);
    movimiento.proveedor = proveedorBase._id;
    movimiento.nombreProveedor = proveedorBase.nombre;
  }

  movimiento.creador = req.usuario._id;

  try {
    const movimientoAlmacenado = await movimiento.save();
    console.log(movimientoAlmacenado);

    await movimientoAlmacenado.save();

    res.json(movimientoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerMovimiento = async (req, res) => {
  const { id } = req.params;

  const movimiento = await Movimientos.findById(id);

  if (!movimiento) {
    const error = new Error("Movimiento no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json({
    movimiento,
  });
};

const editarMovimiento = async (req, res) => {
  const { id } = req.params;
  const { tipo } = req.body;

  const movimiento = await Movimientos.findById(id);

  if (!movimiento) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  movimiento.entidad = req.body.entidad || movimiento.entidad;
  movimiento.precioNeto = req.body.precioNeto || movimiento.precioNeto;
  movimiento.tipo = req.body.tipo || movimiento.tipo;
  movimiento.descripcion = req.body.descripcion || movimiento.descripcion;

  if (tipo === "Ingreso") {
    const { cliente } = req.body;
    const clienteBase = await Cliente.findById(cliente);
    movimiento.cliente = clienteBase._id;
    movimiento.nombreCliente = clienteBase.nombre;
    if (!movimiento.proveedor == "") {
      movimiento.proveedor = undefined;
      movimiento.nombreProveedor = undefined;
    }
  } else {
    const { proveedor } = req.body;
    console.log(proveedor);
    const proveedorBase = await Proveedor.findById(proveedor);
    movimiento.proveedor = proveedorBase._id;
    movimiento.nombreProveedor = proveedorBase.nombre;
    if (!movimiento.cliente == "") {
      movimiento.cliente = undefined;
      movimiento.nombreCliente = undefined;
    }
  }

  try {
    const movimientoAlmacenado = await movimiento.save();
    console.log(movimientoAlmacenado);
    res.json(movimientoAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarMovimiento = async (req, res) => {
  const { id } = req.params;
  const movimiento = await Movimientos.findById(id);

  if (!movimiento) {
    const error = new Error("Movimiento no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  movimiento.pull([id]);

  await movimiento.save();

  res.json({ msg: "Movimiento eliminado correctamente" });
};

const nuevoPagoCliente = async (req, res) => {
  const { cliente } = req.body;
  const movimiento = new Movimientos(req.body);

  const clienteBase = await Cliente.findById(cliente);

  movimiento.cliente = clienteBase._id;
  movimiento.nombreCliente = clienteBase.nombre;
  movimiento.creador = req.usuario._id;

  try {
    // Sumar un mes a la fecha de vencimiento
    const fechaVencimientoActual = moment(clienteBase.fechaVencimiento);
    clienteBase.fechaVencimiento = fechaVencimientoActual
      .add(1, "months")
      .toDate();

    const movimientoAlmacenado = await movimiento.save();
    console.log(movimientoAlmacenado);

    // Actualizar la fecha de vencimiento del cliente
    await clienteBase.save();

    res.json(movimientoAlmacenado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

const obtenerTotalesDashboard = async (req, res) => {
  try {
    const movimientos = await Movimientos.find();

    let totalBanco = 0;
    let totalMp = 0;
    let totalEfectivo = 0;

    movimientos.forEach((movimiento) => {
      const precioNeto = parseFloat(movimiento.precioNeto);

      if (movimiento.entidad === "Banco") {
        totalBanco += movimiento.tipo === "Ingreso" ? precioNeto : -precioNeto;
      } else if (movimiento.entidad === "Mp") {
        totalMp += movimiento.tipo === "Ingreso" ? precioNeto : -precioNeto;
      } else if (movimiento.entidad === "Efectivo") {
        totalEfectivo +=
          movimiento.tipo === "Ingreso" ? precioNeto : -precioNeto;
      }
    });
    console.log({
      efectivo: totalEfectivo.toFixed(2).toString(),
      Mp: totalMp.toFixed(2).toString(),
      Banco: totalBanco.toFixed(2).toString(),
    });
    res.json({
      dash: {
        efectivo: totalEfectivo.toFixed(2).toString(),
        Mp: totalMp.toFixed(2).toString(),
        banco: totalBanco.toFixed(2).toString(),
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error al obtener los totales para el dashboard" });
  }
};

const obtenerResumenPorEntidad = async (req, res) => {
  const { entidad } = req.params;

  // Obtener el mes y año actual
  const hoy = moment();
  const inicioMes = hoy.startOf("month").toDate();
  const finMes = hoy.endOf("month").toDate();

  try {
    // Filtrar movimientos por entidad y mes/año actual
    const movimientosMes = await Movimientos.find({
      entidad: entidad,
      fecha: {
        $gte: inicioMes,
        $lte: finMes,
      },
    });

    let gastado = 0;
    let ingresos = 0;

    movimientosMes.forEach((movimiento) => {
      const precioNeto = parseFloat(movimiento.precioNeto);
      if (movimiento.tipo === "Gasto") {
        gastado += precioNeto;
      } else if (movimiento.tipo === "Ingreso") {
        ingresos += precioNeto;
      }
    });

    // Calcular saldo disponible históricamente
    const movimientosTotales = await Movimientos.find({ entidad: entidad });
    let disponible = 0;

    movimientosTotales.forEach((movimiento) => {
      const precioNeto = parseFloat(movimiento.precioNeto);
      if (movimiento.tipo === "Ingreso") {
        disponible += precioNeto;
      } else if (movimiento.tipo === "Gasto") {
        disponible -= precioNeto;
      }
    });
    console.log({
      gastado: gastado.toFixed(2).toString(),
      ingresos: ingresos.toFixed(2).toString(),
      disponible: disponible.toFixed(2).toString(),
    });

    res.json({
      dash: {
        gastado: gastado.toFixed(2).toString(),
        ingresos: ingresos.toFixed(2).toString(),
        disponible: disponible.toFixed(2).toString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el resumen por entidad" });
  }
};

const obtenerResumenPorMesYEntidad = async (req, res) => {
  const { entidad, mes, ano } = req.body;

  console.log(req.body);

  // Convertir mes y año a un rango de fechas
  const mesFormateado = mes.padStart(2, "0");
  const inicioMes = moment(`${ano}-${mesFormateado}`, "YYYY-MM")
    .startOf("month")
    .toDate();
  const finMes = moment(`${ano}-${mesFormateado}`, "YYYY-MM")
    .endOf("month")
    .toDate();

  try {
    // Filtrar movimientos por entidad, mes y año
    const movimientosMes = await Movimientos.find({
      entidad: entidad,
      fecha: {
        $gte: inicioMes,
        $lte: finMes,
      },
    });

    let gastado = 0;
    let ingresos = 0;

    movimientosMes.forEach((movimiento) => {
      const precioNeto = parseFloat(movimiento.precioNeto);
      if (movimiento.tipo === "Gasto") {
        gastado += precioNeto;
      } else if (movimiento.tipo === "Ingreso") {
        ingresos += precioNeto;
      }
    });

    // Calcular saldo disponible históricamente
    const movimientosTotales = await Movimientos.find({ entidad: entidad });
    let disponible = 0;

    movimientosTotales.forEach((movimiento) => {
      const precioNeto = parseFloat(movimiento.precioNeto);
      if (movimiento.tipo === "Ingreso") {
        disponible += precioNeto;
      } else if (movimiento.tipo === "Gasto") {
        disponible -= precioNeto;
      }
    });

    res.json({
      dash: {
        gastado: gastado.toFixed(2).toString(),
        ingresos: ingresos.toFixed(2).toString(),
        disponible: disponible.toFixed(2).toString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener el resumen" });
  }
};

export {
  obtenerMovimientos,
  nuevoMovimiento,
  obtenerMovimiento,
  editarMovimiento,
  eliminarMovimiento,
  pruebaAfip,
  nuevoPagoCliente,
  obtenerMovimientosPorMesYAno,
  obtenerTotalesDashboard,
  obtenerResumenPorEntidad,
  obtenerResumenPorMesYEntidad,
};
