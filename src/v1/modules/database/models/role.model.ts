import mongoose from 'mongoose';
import { IPermissionModel } from './permission.model';

const roleSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, maxLength: 100, unique: true },
  permissions: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'permissions', default: [], unique: false },
  ],
  deletedAt: { type: Date },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

roleSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

roleSchema.methods.restore = function () {
  this.deletedAt = undefined;
  return this.save();
};

const roleModel = mongoose.model('roles', roleSchema);

interface IRoleModel extends Document {
  _id: string;
  name: string;
  permissions: Partial<IPermissionModel>[];
}
export { IRoleModel, roleModel, roleSchema };
