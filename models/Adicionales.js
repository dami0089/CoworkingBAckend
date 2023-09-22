import mongoose from "mongoose";

const adicionalesSchema = mongoose.Schema(
  {
    fecha: {
      type: Date,
      default: Date.now(),
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
    },
    nombre: {
      type: String,
      trim: true,
      require: true,
    },
    detalle: {
      type: String,
      trim: true,
      require: true,
    },
    importe: {
      type: String,
      trim: true,
      require: true,
    },
    notas: {
      type: String,
      trim: true,
      require: true,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
  }
);

const Adicionales = mongoose.model("Adicionales", adicionalesSchema);

export default Adicionales;
