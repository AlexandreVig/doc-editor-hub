import { Schema, model, Document as MongooseDocument } from "mongoose";

interface IDocument extends MongooseDocument {
  title: string;
  content: string;
  ownerId: string;
  collaborators: string[];
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
}

const DocumentSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
});

export default model<IDocument>("Document", DocumentSchema);
