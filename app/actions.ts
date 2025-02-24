/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';
import requireUser from './utils/requireUser';

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

    const existingSubreddit = await prisma.subreddit.findFirst({
      where: { userId: user.id },
    });

    if (existingSubreddit) {
      return {
        message: 'You can only create one thread per user!',
        status: 'error',
      };
    }

    await prisma.subreddit.create({
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
          message: 'This thread name is already used!',
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

  await prisma.post.create({
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

export async function handleLike(formData: FormData) {
  const user = await requireUser();
  const userId = user.id;
  const postId = formData.get('postId') as string;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      users: true,
    },
  });

  if (!post) {
    throw new Error('post not found');
  }

  if (post.users.some((user) => user.id === userId)) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        users: { disconnect: { id: userId } },
        like: { decrement: 1 },
      },
    });
  } else {
    await prisma.post.update({
      where: { id: postId },
      data: {
        users: { connect: { id: userId } },
        like: { increment: 1 },
      },
    });
  }
  return redirect('/');
}

export async function handleDislike(formData: FormData) {
  const user = await requireUser();
  const userId = user.id;
  const postId = formData.get('postId') as string;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      users: true,
    },
  });

  if (!post) {
    throw new Error('post not found');
  }

  if (post.users.some((user) => user.id === userId)) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        users: { disconnect: { id: userId } },
        disLike: { decrement: 1 },
      },
    });
  } else {
    await prisma.post.update({
      where: { id: postId },
      data: {
        users: { connect: { id: userId } },
        disLike: { increment: 1 },
      },
    });
  }
  return redirect('/');
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
    throw new Error('thread not found');
  }

  if (subreddit.users.some((user) => user.id === userId)) {
    await prisma.subreddit.update({
      where: { id: subredditId },
      data: {
        users: { disconnect: { id: userId } },
        members: { decrement: 1 },
      },
    });
  } else {
    await prisma.subreddit.update({
      where: { id: subredditId },
      data: {
        users: { connect: { id: userId } },
        members: { increment: 1 },
      },
    });
  }
  return redirect('/');
}

export async function createComment(formData: FormData) {
  const user = await requireUser();

  const postId = formData.get('postId') as string;
  const comment = formData.get('comment') as string;
  const threadId = formData.get('threadId') as string;

  await prisma.comment.create({
    data: {
      text: comment,
      userId: user.id,
      postId: postId,
    },
  });
  return redirect(`/subreddit/${threadId}/${postId}`);
}
