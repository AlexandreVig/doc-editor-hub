import Document from "~/server/models/Document";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const { collaboratorId } = await readBody(event);
    const document = await Document.findById(id);
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: "Document not found",
      });
    }
    if (document.collaborators.includes(collaboratorId)) {
      throw createError({
        statusCode: 400,
        statusMessage: "User is already a collaborator",
      });
    }
    document.collaborators.push(collaboratorId);
    await document.save();
    return { message: 'Document shared successfully', document };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error sharing document",
    });
  }
});
