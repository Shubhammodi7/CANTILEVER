import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema, "users");
export default User;
