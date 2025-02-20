import SubDescriptionForm from '@/app/components/SubDescriptionForm';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import prisma from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { handleVoteDOWN, handleVoteUP } from '@/app/actions';
import { ArrowDown, ArrowUp } from 'lucide-react';
import CopyLink from '@/app/components/CopyLink';

import CreateComment from '@/app/components/CreateComment';

async function getSubreddit(name: string) {
  const subreddit = await prisma.subreddit.findUnique({
    where: {
      name: name,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      description: true,
      userId: true,
    },
  });

  return subreddit;
}

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    select: {
      title: true,
      textContent: true,
      voteNumber: true,
      comment: {
        select: {
          createdAt: true,
          text: true,
          id: true,
          User: {
            select: {
              userName: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  return post;
}

const page = async ({
  params,
}: {
  params: { id: string; pageWithComments: string };
}) => {
  const { id, pageWithComments } = params;
  const subreddit = await getSubreddit(id);
  const post = await getPost(pageWithComments);
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="max-w-[1000px] mx-auto mt-4 grid grid-cols-1 md:grid-cols-[65%_35%] gap-5">
      <div>
        <Card className="p-6 shadow-md  rounded-lg">
          <h1 className="text-2xl font-bold ">{post?.title}</h1>
          <p className="mt-4">{post?.textContent}</p>
          <Separator />
          <div className="flex items-center gap-x-4 mt-2">
            <div className="flex items-center bg-primary/50 rounded-lg p-1 gap-x-3">
              <form action={handleVoteUP}>
                <input type="hidden" name="postId" value={pageWithComments} />
                <button>
                  <ArrowUp />
                </button>
              </form>
              {post?.voteNumber}
              <form action={handleVoteDOWN}>
                <input type="hidden" name="postId" value={pageWithComments} />
                <button>
                  <ArrowDown />
                </button>
              </form>
            </div>

            <CopyLink id={pageWithComments} />
          </div>
          <CreateComment postId={pageWithComments} thread={id} />
          <Separator className="mt-2" />
          <CardFooter className="flex flex-col items-start">
            <h2 className="font-semibold text-lg mt-2">All comments</h2>
            {post?.comment?.length > 0 ? (
              post?.comment.map((item) => (
                <div key={item.id} className="flex items-center gap-x-3 mt-3">
                  <Image
                    src={item.User?.imageUrl ?? undefined}
                    alt="user-profile"
                    width={35}
                    height={35}
                    className="rounded-full "
                  />
                  <div className="flex flex-col items-start">
                    <p className="text-muted-foreground text-sm font-medium">
                      {item.createdAt.toISOString().split('', 10)}
                    </p>
                    <p className="text-sm">{item.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-lg mt-2 text-muted-foreground">
                This post doesn't have any comments.
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
      <div className="w-full">
        <Card>
          <div className="bg-muted p-4 font-semibold">About Community</div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Image
                src={`https://avatar.vercel.sh/${subreddit?.name}`}
                alt="image of subreddit"
                width={60}
                height={60}
                className="rounded-full"
              />
              <Link
                href={`/subreddit/${subreddit?.name}`}
                className="font-medium"
              >
                subreddit/{subreddit?.name}
              </Link>
            </div>
            {user?.id === subreddit?.userId ? (
              <SubDescriptionForm
                description={subreddit?.description}
                name={params.id}
              />
            ) : (
              <p className="text-sm font-normal text-secondary-foreground mt-2">
                {subreddit?.description}
              </p>
            )}
            <div className="flex mt-2 gap-x-2 items-center">
              <p className="text-slate-400 font-semibold text-sm">
                Created: {subreddit?.createdAt.toDateString()}
              </p>
            </div>

            <Separator className="my-5" />
            <div className="flex flex-col gap-2">
              <Button className="w-full">
                <Link
                  href={
                    user?.id
                      ? `/subreddit/${subreddit?.name}/create`
                      : '/api/auth/login'
                  }
                >
                  Create Post
                </Link>
              </Button>
              <Button className="w-full" variant="secondary">
                Join
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default page;
