import mongoose from "mongoose";

const visitanteSchema = mongoose.Schema(
  {
    fechaVisita: {
      type: Date,
      default: Date.now(),
    },
    nombre: {
      type: String,
      trim: true,
      require: true,
    },
    dni: {
      type: String,
      trim: true,
    },
    nacionalidad: {
      type: String,
      trim: true,
    },
    fechaNac: {
      type: String,
      trim: true,
    },
    celular: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    motivo: {
      type: String,
      trim: true,
    },
  },
  {
    timestaps: true,
  }
);

const Visitante = mongoose.model("Visitante", visitanteSchema);

export default Visitante;
