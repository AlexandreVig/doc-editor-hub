import Document from "~/server/models/Document";
import { H3Error } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.user._id;
    const id = event.context.params?.id;
    const document = await Document.findById({ _id: id, ownerId: userId }).populate('ownerId collaborators', 'name email');
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found',
      });
    }
    return document;
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching document",
    });
  }
});
