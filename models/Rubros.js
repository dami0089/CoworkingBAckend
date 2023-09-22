import mongoose from "mongoose";

const rubrosSchema = mongoose.Schema(
  {
    nombre: {
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
  },
  {
    timestaps: true,
  }
);

const Rubros = mongoose.model("Rubros", rubrosSchema);

export default Rubros;
