import Planes from "../models/Planes.js";

const obtenerPlanes = async (req, res) => {
  const planes = await Planes.find();

  res.json(planes);
};

const nuevoPlan = async (req, res) => {
  const planes = new Planes(req.body);
  planes.creador = req.usuario._id;

  try {
    const planAlmacenado = await planes.save();
    res.json(planAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerPlan = async (req, res) => {
  const { id } = req.params;

  const plan = await Planes.findById(id);

  if (!plan) {
    const error = new Error("Plan no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json({ plan });

  //obtener las tareas del proyecto
  // const tareas = await Tarea.find().where("proyecto").equals(proyecto._id);

  // res.json({
  //   proyecto,
  //   tareas,
  // });
};

const editarPlan = async (req, res) => {
  const { id } = req.params;

  const plan = await Planes.findById(id);

  if (!plan) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  plan.nombre = req.body.nombre || plan.nombre;
  plan.descripcion = req.body.descripcion || plan.descripcion;
  plan.horasSalas = req.body.horasSalas || plan.horasSalas;
  plan.precio = req.body.precio || plan.precio;

  try {
    const planAlmacenado = await plan.save();
    res.json(planAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

export { obtenerPlanes, nuevoPlan, obtenerPlan, editarPlan };
