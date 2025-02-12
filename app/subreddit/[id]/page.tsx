import { Card } from '@/components/ui/card';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/db';

import SubDescriptionForm from '@/app/components/SubDescriptionForm';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

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
    },
  });

  return data;
}

const SubredditRoute = async ({ params }: { params: { id: string } }) => {
  const data = await getData(params.id);
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <div className="max-w-[1000px] mx-auto flex mt-4 gap-x-10">
      <div className="w-[65%] flex flex-col gap-y-5">
        <h2>post section</h2>
      </div>
      <div className="w-[35%]">
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SubredditRoute;
