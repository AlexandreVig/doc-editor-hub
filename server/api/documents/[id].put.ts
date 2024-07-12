import Document from "~/server/models/Document";
import { H3Error } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const { title, content } = await readBody(event);
    const document = await Document.findById(id);
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found',
      });
    }
    document.title = title || document.title;
    document.content = content || document.content;
    document.timestamps.updatedAt = new Date;
    await document.save();
    return document;
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Error updating document",
    });
  }
});
