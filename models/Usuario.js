import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      trim: true,
    },
    dni: {
      type: String,
      trim: true,
      unique: true,
    },
    nombrePlan: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    celu: {
      type: String,
      trim: true,
    },
    horasSala: {
      type: String,
      trim: true,
    },
    token: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
    isActivo: {
      type: Boolean,
      default: true,
    },
    asistioHoy: {
      type: Boolean,
      default: false,
    },
    cliente: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
      },
    ],
    plan: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Planes",
      },
    ],
  },
  {
    timestams: true,
  }
);

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcryptjs.compare(passwordFormulario, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
