'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export const createVisit = async (formData: FormData) => {
  const session = await auth();

  const title = formData.get('title');
  const content = formData.get('content');

  if (typeof title !== 'string' || typeof content !== 'string') {
    throw new Error('Unexpected form data');
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle || !trimmedContent) {
    // TODO useFormState
    throw new Error('Title and content are required');
  }

  if (!session?.user?.id) {
    throw new Error('You must be logged in to create a visit');
  }

  await prisma.visit.create({
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      userId: +session.user.id,
    },
  });

  redirect('/visits');
};
