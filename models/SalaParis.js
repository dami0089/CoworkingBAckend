import mongoose from "mongoose";

const salaParisSchema = mongoose.Schema(
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

const SalaParis = mongoose.model("SalaParis", salaParisSchema);

export default SalaParis;
