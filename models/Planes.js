import mongoose from "mongoose";

const planesSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      require: true,
    },
    descripcion: [
      {
        type: String,
      },
    ],
    horasSalas: {
      type: String,
      trim: true,
      require: true,
    },
    precio: {
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

const Planes = mongoose.model("Planes", planesSchema);

export default Planes;
