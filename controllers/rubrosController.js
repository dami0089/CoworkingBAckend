import Cliente from "../models/Cliente.js";
import Factura from "../models/Facturas.js";
import Planes from "../models/Planes.js";
import Usuario from "../models/Usuario.js";
import Rubros from "../models/Rubros.js";

const obtenerRubros = async (req, res) => {
  const rubros = await Rubros.find();

  res.json(rubros);
};

const nuevoRubro = async (req, res) => {
  const rubro = new Rubros(req.body);

  //agregamos el plan al Clientes
  rubro.creador = req.usuario._id;

  try {
    const rubroAlmacenado = await rubro.save();

    res.json(rubroAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const editarRubro = async (req, res) => {
  const { id } = req.params;

  const rubro = await Rubros.findById(id);

  if (!rubro) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  rubro.nombre = req.body.nombre || rubro.nombre;

  try {
    const rubroAlmacenado = await rubro.save();
    res.json(rubroAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

export { obtenerRubros, nuevoRubro, editarRubro };
