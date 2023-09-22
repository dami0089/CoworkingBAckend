import Factura from "../models/Facturas.js";
import Cliente from "../models/Cliente.js";

const obtenerFacturas = async (req, res) => {
  const factura = await Factura.find();

  res.json(factura);
};

const nuevaFactura = async (req, res) => {
  const { cliente } = req.body;

  const existeCliente = await Cliente.findById(cliente);

  if (!existeCliente) {
    const error = new Error("El cliente no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const factura = await Factura.create(req.body);
    factura.creador = req.usuario._id;
    const facturaAlmacenada = await factura.save();
    res.json(facturaAlmacenada);

    // factura.creador.push(req.usuario._id);
    res.json(factura);
  } catch (error) {
    console.log(error);
  }
};

const obtenerFactura = async (req, res) => {
  const { id } = req.params;

  const factura = await Factura.findById(id);

  if (!factura) {
    const error = new Error("Plan no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json({ factura });

  //obtener las tareas del proyecto
  // const tareas = await Tarea.find().where("proyecto").equals(proyecto._id);

  // res.json({
  //   proyecto,
  //   tareas,
  // });
};

const editarFactura = async (req, res) => {
  const { id } = req.params;

  const factura = await Factura.findById(id);

  if (!factura) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (factura.cae != "") {
    const error = new Error("Las facturas emitidas no se pueden modificar");
    return res.status(404).json({ msg: error.message });
  }

  factura.tipo = req.body.tipo || factura.tipo;
  factura.numero = req.body.numero || factura.numero;
  factura.cliente = req.body.cliente || factura.cliente;
  factura.descripcion = req.body.descripcion || factura.descripcion;
  factura.precioBruto = req.body.precioBruto || factura.precioBruto;
  factura.iva = req.body.iva || factura.iva;
  factura.precioNeto = req.body.precioNeto || factura.precioNeto;
  factura.creador = req.body.creador || factura.creador;

  try {
    const facturaAlmacenada = await factura.save();
    res.json(facturaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

export { obtenerFacturas, nuevaFactura, obtenerFactura, editarFactura };
