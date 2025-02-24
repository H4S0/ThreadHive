import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Banner from '../public/banner.png';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CreatePostCard from './components/CreatePostCard';
import prisma from '@/lib/db';
import PostCard from './components/PostCard';
import PopularCard from './components/PopularCard';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

async function getData() {
  const data = await prisma.post.findMany({
    select: {
      title: true,
      createdAt: true,
      textContent: true,
      id: true,
      voteNumber: true,
      comment: true,
      User: {
        select: {
          userName: true,
        },
      },
      Subreddit: {
        select: {
          id: true,
        },
      },
      subName: true,
      imageString: true,
    },
    orderBy: {
      createdAt: 'desc',
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

export default async function Home() {
  const data = await getData();
  const popularCommunities = await getPopularCommunities();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="flex flex-col sm:flex-row sm:max-w-[1000px] sm:mx-auto sm:gap-x-10 sm:mt-2 p-2">
      <div className="sm:w-[65%] flex flex-col gap-y-5">
        <CreatePostCard user={user} />
        {data.map((post) => {
          return (
            <PostCard
              commentLength={post.comment.length}
              voteNumber={post.voteNumber}
              key={post.id}
              id={post.id}
              title={post.title}
              imageString={post?.imageString as string}
              textContent={post.textContent}
              subName={post.subName as string}
              userName={post.User?.userName as string}
              createdAt={post.createdAt}
            />
          );
        })}
      </div>
      <div className="sm:w-[35%] flex-col gap-y-5 sm:flex mt-4">
        <Card>
          <Image src={Banner} alt="banner" />
          <div className="p-2 flex flex-col gap-5">
            <h1 className="font-medium pl-3">Home</h1>

            <p className="text-sm text-muted-foreground ">
              Your Home ThreadHive frontpage. Come here to check in with your
              favorite communities.
            </p>
            <Separator />

            <Button asChild>
              <Link href={'/subreddit/create'}>Create Community</Link>
            </Button>
          </div>
        </Card>
        <Card className="mt-4">
          <div className="p-3 flex flex-col ">
            {popularCommunities.length > 0 ? (
              [...popularCommunities]
                .sort((a, b) => b.members - a.members)
                .map((community) => (
                  <PopularCard data={community} key={community.id} />
                ))
            ) : (
              <p>There is no communities</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
