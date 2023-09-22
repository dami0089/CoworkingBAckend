import mongoose from "mongoose";

const facturasProveedorSchema = mongoose.Schema(
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
    proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proveedor",
    },
    nombreProveedor: {
      type: String,
      trim: true,
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
    idPago: {
      type: String,
      trim: true,
    },
    fechaPago: {
      type: Date,
      default: Date.now(),
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

const FacturasProveedor = mongoose.model(
  "FacturasProveedor",
  facturasProveedorSchema
);

export default FacturasProveedor;
