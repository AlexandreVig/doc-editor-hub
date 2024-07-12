import { d as defineEventHandler, c as createError, H as H3Error } from '../../../runtime.mjs';
import { D as Document } from '../../../_/Document.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'mongoose';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'bcrypt';

const _id__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const userId = event.context.user._id;
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const document = await Document.findById({ _id: id, ownerId: userId }).populate("ownerId collaborators", "name email");
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: "Document not found"
      });
    }
    return document;
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching document"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
