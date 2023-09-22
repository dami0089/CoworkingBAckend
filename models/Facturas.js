import mongoose from "mongoose";

const facturaSchema = mongoose.Schema(
  {
    fecha: {
      type: Date,
      default: Date.now(),
    },
    tipo: {
      type: String,
      trim: true,
      require: true,
    },
    numero: {
      type: String,
      trim: true,
      require: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
    },
    descripcion: {
      type: String,
      trim: true,
      require: true,
    },
    precioBruto: {
      type: String,
      trim: true,
      require: true,
    },
    iva: {
      type: String,
      trim: true,
      require: true,
    },
    precioNeto: {
      type: String,
      trim: true,
      require: true,
    },
    cae: {
      type: String,
      trim: true,
      require: true,
    },
    estado: {
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

const Factura = mongoose.model("Factura", facturaSchema);

export default Factura;
