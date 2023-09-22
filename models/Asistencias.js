import mongoose from "mongoose";

const asistenciasSchema = mongoose.Schema(
  {
    fecha: {
      type: Date,
      default: Date.now(),
    },
    asistioHoy: {
      type: Boolean,
      default: true,
    },
    nombreUsuario: {
      type: String,
      trim: true,
    },
    usuario: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
  },
  {
    timestaps: true,
  }
);

const Asistencias = mongoose.model("Asistencias", asistenciasSchema);

export default Asistencias;
