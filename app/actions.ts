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
