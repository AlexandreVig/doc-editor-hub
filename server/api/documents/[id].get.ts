import Document from "~/server/models/Document";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const document = await Document.findById(id).populate('ownerId collaborators', 'name email');
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found',
      });
    }
    return document;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching document",
    });
  }
});
