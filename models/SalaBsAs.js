import mongoose from "mongoose";

const salaBsAsSchema = mongoose.Schema(
  {
    fechaCreacion: {
      type: Date,
      default: Date.now(),
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    nombreCliente: {
      type: String,
      trim: true,
    },
    nombreUsuario: {
      type: String,
      trim: true,
    },
    fechaReserva: {
      type: Date,
    },
    horaInicio: {
      type: String,
      trim: true,
    },
    horaFin: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const SalaBsAs = mongoose.model("SalaBsAs", salaBsAsSchema);

export default SalaBsAs;
