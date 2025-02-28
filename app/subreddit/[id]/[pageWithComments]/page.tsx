import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import prisma from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { handleDislike, handleLike, setJoin } from '@/app/actions';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import CopyLink from '@/app/components/CopyLink';
import CreateComment from '@/app/components/CreateComment';
import SubDescriptionForm from '@/app/components/SubDescriptionForm';

async function getPopularCommunities() {
  const popularCommunities = await prisma.subreddit.findMany({
    select: {
      name: true,
      id: true,
      members: true,
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  return popularCommunities;
}

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
      like: true,
      disLike: true,
      imageString: true,
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

const page = async (props: {
  params: Promise<{ id: string; pageWithComments: string }>;
}) => {
  const params = await props.params;
  const { id, pageWithComments } = await params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const popularCommunities = await getPopularCommunities();
  const subreddit = await getSubreddit(id);
  const post = await getPost(pageWithComments);

  const isJoined = popularCommunities.some(
    (community) =>
      community.id === subreddit?.id &&
      community.users.some((u) => u.id === user?.id)
  );

  return (
    <div className="max-w-[1000px] mx-auto mt-4 grid grid-cols-1 md:grid-cols-[65%_35%] gap-5">
      <div>
        <Card className="p-6 shadow-md  rounded-lg">
          <h1 className="text-2xl font-bold ">{post?.title}</h1>
          {post?.imageString ? (
            <Image
              src={post.imageString}
              alt="post-image"
              width={300}
              height={150}
              className="p-2"
            />
          ) : (
            <p className="p-2">{post?.textContent}</p>
          )}
          <Separator />
          <div className="flex items-center gap-x-4 mt-2">
            <div className="flex items-center bg-primary/50 rounded-lg gap-x-3 p-2">
              <form action={handleLike} className="flex items-center gap-x-2">
                <input type="hidden" name="postId" value={pageWithComments} />
                {post?.like}
                <button>
                  <ThumbsUp />
                </button>
              </form>

              <form
                action={handleDislike}
                className="flex items-center gap-x-2"
              >
                <input type="hidden" name="postId" value={pageWithComments} />
                {post?.disLike}
                <button>
                  <ThumbsDown />
                </button>
              </form>
            </div>

            <CopyLink id={pageWithComments} thread={id} />
          </div>
          <CreateComment postId={pageWithComments} thread={id} />
          <Separator className="mt-2" />
          <CardFooter className="flex flex-col items-start">
            <h2 className="font-semibold text-lg mt-2">All comments</h2>
            {post?.comment?.length ? (
              post?.comment.map((item) => (
                <div key={item.id} className="flex items-center gap-x-3 mt-3">
                  <Image
                    src={item.User?.imageUrl || ''}
                    alt="user-profile"
                    width={35}
                    height={35}
                    className="rounded-full"
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
                There is no comments yet. Be first!!
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
                thread/{subreddit?.name}
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
              <form action={setJoin}>
                <input type="hidden" name="subredditId" value={subreddit?.id} />
                <Button className="w-full" variant="secondary">
                  {isJoined ? 'leave' : 'join'}
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default page;
