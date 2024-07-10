interface docUser {
  _id: string;
  email: string;
  name?: string;
}

export interface docCard {
  _id: string;
  title: string;
  ownerId: docUser;
  collaborators: docUser[];
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
}
