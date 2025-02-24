import { Separator } from '@/components/ui/separator';

import React from 'react';
import { rules } from '../data/rules';
import prisma from '@/lib/db';
import { Card } from '@/components/ui/card';
import { Waypoints } from 'lucide-react';
import CreatePostForm from '../components/CreatePostForm';

async function getSubreddit() {
  const data = await prisma.subreddit.findMany({
    select: {
      name: true,
      id: true,
    },
  });

  return data;
}

const PostHome = async () => {
  const subreddit = await getSubreddit();
  return (
    <div className="max-w-[1000px] mx-auto flex flex-col lg:flex-row gap-x-10 mt-4 p-4">
      <div className="w-full lg:w-[65%] flex flex-col gap-y-5">
        <CreatePostForm subreddit={subreddit} />
      </div>
      <div className="w-full lg:w-[35%] mt-8 lg:mt-0">
        <Card className="flex flex-col p-4">
          <div className="flex items-center gap-x-2">
            <Waypoints className="h-12 w-fit text-primary animate-spin" />
            <h1 className="font-medium text-lg">Posting to Reddit</h1>
          </div>
          <Separator className="mt-2" />

          <div className="flex flex-col gap-y-5 mt-5">
            {rules.map((item) => (
              <div key={item.id}>
                <p className="text-sm font-medium">
                  {item.id}. {item.text}
                </p>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PostHome;
