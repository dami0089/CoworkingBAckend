import mongoose from "mongoose";

const salaCabinaSchema = mongoose.Schema(
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

const SalaCabina = mongoose.model("SalaCabina", salaCabinaSchema);

export default SalaCabina;
