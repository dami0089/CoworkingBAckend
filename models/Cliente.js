import mongoose from "mongoose";

const clienteSchema = mongoose.Schema(
  {
    tipo: {
      type: String,
    },
    nombre: {
      type: String,
      trim: true,
      require: true,
    },
    cuit: {
      type: String,
      trim: true,
      require: true,
      unique: true,
    },
    domicilio: {
      type: String,
      trim: true,
      require: true,
    },
    mailFactura: {
      type: String,
      trim: true,
      require: true,
    },
    fechaAlta: {
      type: Date,
      default: Date.now(),
    },
    fechaVencimiento: {
      type: Date,
      default: Date.now(),
    },
    isActivo: {
      type: Boolean,
      default: true,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    planes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Planes",
      },
    ],
    usuarios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
      },
    ],
    facturas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Factura",
      },
    ],
    recibos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recibos",
      },
    ],
    adicionales: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Adicionales",
      },
    ],
  },
  {
    timestaps: true,
  }
);

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;
