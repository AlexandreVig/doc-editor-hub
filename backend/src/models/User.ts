import { Schema, model, Document as MongooseDocument } from 'mongoose';

interface IUser extends MongooseDocument {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  timestamps: true
});

export default model<IUser>('User', userSchema);
