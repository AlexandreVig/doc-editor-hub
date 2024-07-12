import Document from "~/server/models/Document";
import { H3Error } from 'h3';

export default defineEventHandler(async (event) => {
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
      statusMessage: "Error creating document",
    });
  }
});
