import Document from "~/server/models/Document";
import { H3Error } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.user._id;

    const ownedDocuments = await Document.find({ ownerId: userId })
      .select("-content")
      .populate('ownerId', 'email _id name')
      .populate("collaborators", 'email _id name');

    const sharedDocuments = await Document.find({ collaborators: userId })
      .select("-content")
      .populate('ownerId', 'email _id name')
      .populate("collaborators", 'email _id name');

    return {
      ownedDocuments,
      sharedDocuments,
    };
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching documents",
    });
  }
});
