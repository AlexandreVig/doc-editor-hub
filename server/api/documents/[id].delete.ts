import Document from "~/server/models/Document";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const document = await Document.findByIdAndDelete(id);
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found',
      });
    }
    return { message: 'Document deleted successfully' };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error deleting document",
    });
  }
});
