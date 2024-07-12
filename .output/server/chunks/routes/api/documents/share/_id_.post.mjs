import { d as defineEventHandler, r as readBody, U as UserModel, c as createError, H as H3Error } from '../../../../runtime.mjs';
import { D as Document } from '../../../../_/Document.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'mongoose';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'bcrypt';

const _id__post = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const { email } = await readBody(event);
    const collaborator = await UserModel.findOne({ email });
    const document = await Document.findById(id);
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: "Document not found"
      });
    }
    if (!collaborator) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found"
      });
    }
    if (document.collaborators.includes(collaborator._id)) {
      throw createError({
        statusCode: 400,
        statusMessage: "User is already a collaborator"
      });
    }
    document.collaborators.push(collaborator._id);
    await document.save();
    return { message: "Document shared successfully", document };
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Error sharing document"
    });
  }
});

export { _id__post as default };
//# sourceMappingURL=_id_.post.mjs.map
