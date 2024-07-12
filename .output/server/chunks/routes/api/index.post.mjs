import { d as defineEventHandler, r as readBody, H as H3Error, c as createError } from '../../runtime.mjs';
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

const index_post = defineEventHandler(async (event) => {
  try {
    const { title, content } = await readBody(event);
    const document = new Document({
      title,
      content,
      ownerId: event.context.user._id,
      collaborators: []
    });
    await document.save();
    return document;
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Error creating document"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
