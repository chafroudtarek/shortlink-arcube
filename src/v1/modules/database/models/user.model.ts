import mongoose from 'mongoose';
import { IRoleModel } from './role.model';
import * as bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true, maxLength: 100 },
    lastName: { type: String, required: true, maxLength: 100 },
    fullName: { type: String, required: true, maxLength: 200 },
    username: { type: String, required: true, maxLength: 100, unique: true },
    email: { type: String, required: true, unique: true, maxLength: 250 },
    age: { type: Number, required: false },
    password: { type: String, required: true },
    birthDate: { type: Date, required: false },
    isVerified: { type: Boolean, required: true, default: false },
    picture: { type: String, required: false, default: null },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'roles', default: [], unique: false }],
    deletedAt: { type: Date },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

userSchema.methods.restore = function () {
  this.deletedAt = undefined;
  return this.save();
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // If the password is not modified, skip the hook
  }
  const salt = await bcrypt.genSalt(13);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
});
const userModel = mongoose.model('users', userSchema);

interface IUserModel extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  age: number;
  password: string;
  birthDate: Date;
  isVerified: boolean;
  roles: Array<IRoleModel>;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export { IUserModel, userModel, userSchema };
