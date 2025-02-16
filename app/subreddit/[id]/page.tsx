import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/db';
import SubDescriptionForm from '@/app/components/SubDescriptionForm';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import requireUser from '@/app/utils/requireUser';

import { Heart, TimerIcon } from 'lucide-react';

async function getData(name: string) {
  const data = await prisma.subreddit.findUnique({
    where: {
      name: name,
    },
    select: {
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
        },
      },
    },
  });

  return data;
}

const SubredditRoute = async ({ params }: { params: { id: string } }) => {
  const data = await getData(params.id);
  const user = await requireUser();
  const hoursNow = new Date().getHours();
  return (
    <div className="max-w-[1000px] mx-auto mt-4 grid grid-cols-1 md:grid-cols-[65%_35%] gap-5">
      <div className="flex flex-col gap-y-5">
        {data?.posts.map((post) => (
          <Card key={post.id} className="p-4">
            <CardHeader className="flex flex-row items-center gap-x-3">
              <p className="font-semibold text-xl">{post.title}</p>
              <div className="flex items-center">
                <TimerIcon className="w-4 h-4" />
                <p>{hoursNow - post.createdAt.getHours()}hr. ago</p>
              </div>
            </CardHeader>
            <CardContent>
              <Separator />
              <p className="mt-2">{post.textContent}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="w-full">
        <Card>
          <div className="bg-muted p-4 font-semibold">About Community</div>
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
                subreddit/{data?.name}
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
              <Button className="w-full">
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

export default SubredditRoute;
