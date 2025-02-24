import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/db';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import { ArrowDown, ArrowUp, MessageCircle } from 'lucide-react';
import CopyLink from '@/app/components/CopyLink';
import { handleVoteDOWN, handleVoteUP, setJoin } from '@/app/actions';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import SubDescriptionForm from '@/app/components/SubDescriptionForm';

async function getData(name: string) {
  const data = await prisma.subreddit.findUnique({
    where: {
      name: name,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      description: true,
      userId: true,
      posts: {
        select: {
          title: true,
          textContent: true,
          imageString: true,
          id: true,
          createdAt: true,
          voteNumber: true,
          comment: true,
        },
      },
    },
  });

  return data;
}

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

const SubredditRoute = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const { getUser } = getKindeServerSession();
  const popularCommunities = await getPopularCommunities();
  const user = await getUser();
  const data = await getData(params.id);

  const subredditId = data?.id;

  console.log();

  const isJoined = popularCommunities.some(
    (community) =>
      community.id === subredditId &&
      community.users.some((u) => u.id === user.id)
  );

  if (!data) {
    return <p>loading..</p>;
  }

  return (
    <div className="max-w-[1000px] mx-auto mt-4 grid grid-cols-1 md:grid-cols-[65%_35%] gap-5">
      <div className="flex flex-col gap-y-5">
        {data.posts.length > 0 ? (
          data?.posts.map((post) => (
            <Card key={post.id} className="p-4">
              <CardHeader className="flex flex-row items-center gap-x-3">
                <p className="font-semibold text-xl">{post.title}</p>
              </CardHeader>
              <CardContent>
                <Separator />
                <p className="mt-2">{post.textContent}</p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-x-4">
                  <div className="flex items-center bg-primary/50 rounded-lg p-1 gap-x-3">
                    <form action={handleVoteUP}>
                      <input type="hidden" name="postId" value={post.id} />
                      <button>
                        <ArrowUp />
                      </button>
                    </form>
                    {post.voteNumber}
                    <form action={handleVoteDOWN}>
                      <input type="hidden" name="postId" value={post.id} />
                      <button>
                        <ArrowDown />
                      </button>
                    </form>
                  </div>

                  <Link
                    href={`/subreddit/${data.name}/${post.id}`}
                    className="flex items-center gap-x-2"
                  >
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium text-sm">
                      {post.comment.length}
                    </p>
                  </Link>

                  <CopyLink id={post.id} />
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-xl text-muted-foreground font-semibold">
            This thread doesnt have active post. Be first to create one!
          </p>
        )}
      </div>

      <Card className="w-full">
        <div className="p-4 font-semibold">About Community</div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Image
              src={`https://avatar.vercel.sh/${data?.name}`}
              alt="image of subreddit"
              width={60}
              height={60}
              className="rounded-full"
            />
            <Link href={`/subreddit/${data?.name}`} className="font-medium">
              thread/{data?.name}
            </Link>
          </div>
          {user?.id === data?.userId ? (
            <SubDescriptionForm
              description={data?.description}
              name={params.id}
            />
          ) : (
            <p className="text-sm font-normal text-secondary-foreground mt-2">
              {data?.description}
            </p>
          )}
          <div className="flex mt-2 gap-x-2 items-center">
            <p className="text-slate-400 font-semibold text-sm">
              Created: {data?.createdAt.toDateString()}
            </p>
          </div>

          <Separator className="my-5" />
          <div className="flex flex-col gap-2">
            <Button className="w-full" asChild>
              <Link
                href={
                  user?.id
                    ? `/subreddit/${data?.name}/create`
                    : '/api/auth/login'
                }
              >
                Create Post
              </Link>
            </Button>
            <form action={setJoin}>
              <input type="hidden" name="subredditId" value={subredditId} />
              <Button className="w-full" variant="secondary">
                {isJoined ? 'LEAVE' : 'JOIN'}
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubredditRoute;
