import { d as defineEventHandler, r as readBody, c as createError, H as H3Error } from '../../../runtime.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const { title, content } = await readBody(event);
    const document = await Document.findById(id);
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: "Document not found"
      });
    }
    document.title = title || document.title;
    document.content = content || document.content;
    document.timestamps.updatedAt = /* @__PURE__ */ new Date();
    await document.save();
    return document;
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Error updating document"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
