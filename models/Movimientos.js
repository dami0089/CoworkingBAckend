import mongoose from "mongoose";

const movimientosSchema = mongoose.Schema(
  {
    fecha: {
      type: Date,
      default: Date.now(),
    },
    entidad: {
      type: String,
      trim: true,
    },
    tipo: {
      type: String,
      trim: true,
    },
    proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proveedor",
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
    },
    nombreProveedor: {
      type: String,
      trim: true,
    },
    nombreCliente: {
      type: String,
      trim: true,
    },
    numeroFactura: {
      type: String,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    precioBruto: {
      type: String,
      trim: true,
    },
    iva: {
      type: String,
      trim: true,
    },
    precioNeto: {
      type: String,
      trim: true,
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

const Movimientos = mongoose.model("Movimientos", movimientosSchema);

export default Movimientos;
