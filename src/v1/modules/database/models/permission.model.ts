import mongoose from 'mongoose';
import { IRoleModel } from './role.model';

const permissionSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, maxLength: 100, unique: true },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'roles', defaualt: [], unique: false }],
  deletedAt: { type: Date },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

permissionSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

permissionSchema.methods.restore = function () {
  this.deletedAt = undefined;
  return this.save();
};

const permissionModel = mongoose.model('permissions', permissionSchema);

interface IPermissionModel extends Document {
  _id: string;
  name: string;
  roles: Array<IRoleModel>;
}
export { IPermissionModel, permissionModel, permissionSchema };
