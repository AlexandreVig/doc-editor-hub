import Document from "~/server/models/Document";
import UserModel from '~/server/models/user';
import { H3Error } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const { email } = await readBody(event);
    const collaborator = await UserModel.findOne({ email });
    const document = await Document.findById(id);
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: "Document not found",
      });
    }
    if (!collaborator) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }
    if (document.collaborators.includes(collaborator._id)) {
      throw createError({
        statusCode: 400,
        statusMessage: "User is already a collaborator",
      });
    }
    document.collaborators.push(collaborator._id);
    await document.save();
    return { message: 'Document shared successfully', document };
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Error sharing document",
    });
  }
});
