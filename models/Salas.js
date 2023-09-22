import mongoose from "mongoose";

const salasSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      require: true,
    },
    descripcion: {
      type: String,
      trim: true,
      require: true,
    },
    precio: {
      type: String,
      trim: true,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Salas = mongoose.model("Salas", salasSchema);

export default Salas;
