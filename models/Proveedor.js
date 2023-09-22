import mongoose from "mongoose";

const proveedorSchema = mongoose.Schema(
  {
    tipo: {
      type: String,
      require: true,
      enum: ["A", "B", "C"],
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
    email: {
      type: String,
      trim: true,
      require: true,
    },
    fechaAlta: {
      type: Date,
      default: Date.now(),
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    facturas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Factura",
      },
    ],
  },
  {
    timestaps: true,
  }
);

const Proveedor = mongoose.model("Proveedor", proveedorSchema);

export default Proveedor;
