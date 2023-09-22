import Proveedor from "../models/Proveedor.js";

import FacturasProveedor from "../models/FacturasProveedor.js";

const obtenerProveedores = async (req, res) => {
  const proveedor = await Proveedor.find();

  res.json(proveedor);
};

const obtenerFacturasaPagar = async (req, res) => {
  // Obtener la fecha actual
  const fechaActual = new Date();

  // Buscar las facturas con una fecha de pago posterior o igual a la fecha actual y ordenarlas por fecha de pago en orden ascendente
  const facturas = await FacturasProveedor.find({
    fechaPago: { $gte: fechaActual },
    estado: "Pendiente",
  }).sort({ fechaPago: 1 });

  res.json(facturas);
};

const pagarFactura = async (req, res) => {
  const { id } = req.params;
  const { idPago } = req.body;

  console.log(id);
  console.log(idPago);

  const facturaAPagar = await FacturasProveedor.findById(id);

  console.log("factura a Pagar: " + facturaAPagar);

  facturaAPagar.estado = "Abonada";
  facturaAPagar.idPago = idPago;

  console.log("factura con estado: " + facturaAPagar);

  try {
    console.log("entro a almacenar");
    await facturaAPagar.save();
    console.log("estado Cambiado!");
  } catch (error) {
    res.json(error);
  }
};

const comprobarProveedor = async (req, res) => {
  const { cuit } = req.body;

  const existeProveedor = await Proveedor.findOne({ cuit });

  if (existeProveedor) {
    const error = new Error("Proveedor ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  res.json({ msg: "ok" });
};

const comprobarAfip = async (req, res) => {
  // const path = require("path");
  // const { cuit } = req.body;
  // // const Afip = require("afipsdk/afip.js");
  // const afip = new Afip({
  //   CUIT: 20342955119,
  //   cert: path.resolve(__dirname, "AFIP.pem"),
  // });
  // try {
  //   const taxpayerDetails = await afip.RegisterScopeThirteen.getTaxpayerDetails(
  //     cuit
  //   );
  //   res.json(taxpayerDetails);
  // } catch (error) {
  //   console.log(error);
  // }
};

const nuevoProveedor = async (req, res) => {
  const proveedor = new Proveedor(req.body);

  proveedor.creador = req.usuario._id;

  try {
    const proveedorAlmacenado = await proveedor.save();

    res.json(proveedorAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const cargarFactura = async (req, res) => {
  console.log(req.body);
  const { proveedor } = req.body;
  const proveedorAlmacenado = await Proveedor.findById(proveedor);
  const factura = new FacturasProveedor(req.body);
  console.log(proveedorAlmacenado);
  factura.creador = req.usuario._id;
  factura.nombreProveedor = proveedorAlmacenado.nombre;

  try {
    const facturaAlmacenada = await factura.save();
    console.log(facturaAlmacenada);
    proveedorAlmacenado.facturas.push(facturaAlmacenada._id);
    await proveedorAlmacenado.save();
    res.json(facturaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

const obtenerProveedor = async (req, res) => {
  const { id } = req.params;

  const proveedor = await Proveedor.findById(id);

  if (!proveedor) {
    const error = new Error("Proveedor no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // res.json({ cliente });

  //obtener las facturas del cliente
  // const facturas = await Factura.find().where("cliente").equals(cliente._id);

  res.json({
    proveedor,
  });
};

const editarProveedor = async (req, res) => {
  const { id } = req.params;

  const proveedor = await Proveedor.findById(id);

  if (!proveedor) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  proveedor.tipo = req.body.tipo || proveedor.tipo;
  proveedor.nombre = req.body.nombre || proveedor.nombre;
  proveedor.email = req.body.email || proveedor.email;

  try {
    const proveedorAlmacenado = await proveedor.save();
    res.json(proveedorAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

export {
  editarProveedor,
  obtenerProveedor,
  nuevoProveedor,
  comprobarProveedor,
  obtenerProveedores,
  comprobarAfip,
  cargarFactura,
  obtenerFacturasaPagar,
  pagarFactura,
};
