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
      require: true,
    },
    tipo: {
      type: String,
      trim: true,
      require: true,
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
      require: true,
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
