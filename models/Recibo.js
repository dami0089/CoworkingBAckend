import mongoose from "mongoose";

const reciboSchema = mongoose.Schema(
  {
    fecha: {
      type: Date,
      default: Date.now(),
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
    facturas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Factura",
      },
    ],
    medioPago: {
      type: String,
      trim: true,
      require: true,
    },
    importe: {
      type: String,
      trim: true,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recibo = mongoose.model("Recibo", reciboSchema);

export default Recibo;
