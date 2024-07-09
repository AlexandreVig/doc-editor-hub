import { Request, Response } from 'express';
import Document from '../models/Document';

export const createDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const document = new Document({
      title,
      content,
      ownerId: req.user.id,
      collaborators: []
    });
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating document' });
  }
};

export const getDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id).populate('ownerId collaborators', 'name email');
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching document' });
  }
};

export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const document = await Document.findById(id);
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    document.title = title || document.title;
    document.content = content || document.content;
    document.timestamps.updatedAt = new Date;
    await document.save();
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ error: 'Error updating document' });
  }
};

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const document = await Document.findByIdAndDelete(id);
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting document' });
  }
};

export const shareDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { collaboratorId } = req.body;
    const document = await Document.findById(id);
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    if (document.collaborators.includes(collaboratorId)) {
      res.status(400).json({ error: 'User is already a collaborator' });
      return;
    }
    document.collaborators.push(collaboratorId);
    await document.save();
    res.status(200).json({ message: 'Document shared successfully', document });
  } catch (error) {
    res.status(500).json({ error: 'Error sharing document' });
  }
};

// Other document-related handlers...