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

export async function createPost(formData: FormData) {
  const user = await requireUser();

  const title = formData.get('title') as string;
  const imageUrl = formData.get('imageUrl') as string | null;
  const subName = formData.get('subName') as string;
  const textContent = formData.get('textContent') as string;

  const data = await prisma.post.create({
    data: {
      title: title,
      imageString: imageUrl ?? undefined,
      subName: subName,
      userId: user.id,
      textContent: textContent,
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

export async function setJoin(formData: FormData) {
  const user = await requireUser();
  const userId = user.id;
  const subredditId = formData.get('subredditId') as string;

  const subreddit = await prisma.subreddit.findUnique({
    where: { id: subredditId },
    include: {
      users: true,
    },
  });

  if (!subreddit) {
    throw new Error('subreddit not found');
  }

  if (subreddit.users.some((user) => user.id === userId)) {
    // If user is already a member, unjoin (disconnect) and decrement members count
    await prisma.subreddit.update({
      where: { id: subredditId },
      data: {
        users: { disconnect: { id: userId } }, // Disconnect the user
        members: { decrement: 1 }, // Decrement the member count
      },
    });
  } else {
    // If user is not a member, join (connect) and increment members count
    await prisma.subreddit.update({
      where: { id: subredditId },
      data: {
        users: { connect: { id: userId } }, // Connect the user
        members: { increment: 1 }, // Increment the member count
      },
    });
  }
  return redirect('/');
}
