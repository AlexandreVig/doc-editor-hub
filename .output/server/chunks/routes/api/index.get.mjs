import { d as defineEventHandler, H as H3Error, c as createError } from '../../runtime.mjs';
import { D as Document } from '../../_/Document.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'mongoose';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'bcrypt';

const index_get = defineEventHandler(async (event) => {
  try {
    const userId = event.context.user._id;
    const ownedDocuments = await Document.find({ ownerId: userId }).select("-content").populate("ownerId", "email _id name").populate("collaborators", "email _id name");
    const sharedDocuments = await Document.find({ collaborators: userId }).select("-content").populate("ownerId", "email _id name").populate("collaborators", "email _id name");
    return {
      ownedDocuments,
      sharedDocuments
    };
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching documents"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
