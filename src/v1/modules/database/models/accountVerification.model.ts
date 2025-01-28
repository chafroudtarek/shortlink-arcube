import mongoose from 'mongoose';

const accountVerificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, required: false, ref: 'users' },
    emailToken: { type: String, required: false, default: null },
    phoneCode: { type: String, required: false, default: null },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

accountVerificationSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

accountVerificationSchema.methods.restore = function () {
  this.deletedAt = undefined;
  return this.save();
};

const accountVerificationModel = mongoose.model('accountsverifications', accountVerificationSchema);

interface IAccountVerificationModel extends Document {
  _id: string;
  userId: string;
  emailToken: string;
  phoneCode: string;
  used: boolean;
  expiresAt: Date;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export { IAccountVerificationModel, accountVerificationModel, accountVerificationSchema };
