import { model, Schema } from 'mongoose';

const DocumentSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
});
const Document = model("Document", DocumentSchema);

export { Document as D };
//# sourceMappingURL=Document.mjs.map
