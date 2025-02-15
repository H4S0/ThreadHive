'use server';

import prisma from '@/lib/db';
import { Prisma, voteType } from '@prisma/client';
import { redirect } from 'next/navigation';
import requireUser from './utils/requireUser';
import { JSONContent } from '@tiptap/react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { revalidatePath } from 'next/cache';

export async function updateUsername(prevState: any, formData: FormData) {
  const user = await requireUser();

  const username = formData.get('username') as string;

  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        userName: username,
      },
    });

    return {
      message: 'Succesfully Updated name',
      status: 'green',
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return {
          message: 'This username is alredy used',
          status: 'error',
        };
      }
    }

    throw e;
  }
}

export async function createSubreddit(prevState: any, formData: FormData) {
  const user = await requireUser();

  try {
    const name = formData.get('name') as string;
    const data = await prisma.subreddit.create({
      data: {
        name: name,
        userId: user.id,
      },
    });
    return redirect('/');
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return {
          message: 'This community name is already used!',
          status: 'error',
        };
      }
    }
    throw e;
  }
}

export async function updateSubDescription(prevState: any, formData: FormData) {
  const user = await requireUser();
  const subName = formData.get('subName') as string;
  const description = formData.get('description') as string;
  try {
    await prisma.subreddit.update({
      where: {
        name: subName,
      },
      data: {
        description: description,
      },
    });
    return {
      status: 'green',
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return {
          status: 'error',
          message: 'Fail to update description',
        };
      }
    }
  }
}

export async function createPost(
  { jsonContent }: { jsonContent: JSONContent | null },
  formData: FormData
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect('/api/auth/login');
  }

  const title = formData.get('title') as string;
  const imageUrl = formData.get('imageUrl') as string | null;
  const subName = formData.get('subName') as string;

  const data = await prisma.post.create({
    data: {
      title: title,
      imageString: imageUrl ?? undefined,
      subName: subName,
      userId: user.id,
      textContent: jsonContent ?? undefined,
    },
  });

  return redirect('/');
}

export async function handleVote(formData: FormData) {
  const user = await requireUser();

  const postId = formData.get('postId') as string;
  const voteDirection = formData.get('voteDirection') as voteType;

  const vote = await prisma.vote.findFirst({
    where: {
      postId: postId,
      userId: user.id,
    },
  });

  if (vote) {
    if (vote.voteType === voteDirection) {
      await prisma.vote.delete({
        where: {
          id: vote.id,
        },
      });

      return revalidatePath('/', 'page');
    } else {
      await prisma.vote.update({
        where: {
          id: vote.id,
        },
        data: {
          voteType: voteDirection,
        },
      });
      return revalidatePath('/', 'page');
    }
  }

  await prisma.vote.create({
    data: {
      voteType: voteDirection,
      userId: user.id,
      postId: postId,
    },
  });

  return revalidatePath('/', 'page');
}
