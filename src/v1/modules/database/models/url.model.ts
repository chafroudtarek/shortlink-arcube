import mongoose, { Document } from 'mongoose';

const urlSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  originalUrl: {
    type: String,
    required: true,
    maxLength: 2000,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    maxLength: 10,
  },
  accessCount: {
    type: Number,
    default: 0,
  },
  lastAccessedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Add soft delete method
urlSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

// Add restore method
urlSchema.methods.restore = function () {
  this.deletedAt = undefined;
  return this.save();
};

const urlModel = mongoose.model('urls', urlSchema);

interface IUrlModel extends Document {
  _id: string;
  originalUrl: string;
  shortCode: string;
  accessCount: number;
  lastAccessedAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  softDelete: () => Promise<IUrlModel>;
  restore: () => Promise<IUrlModel>;
}

export { IUrlModel, urlModel, urlSchema };
