import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Banner from '../public/banner.png';
import HelloImage from '../public/hero-image.png';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CreatePostCard from './components/CreatePostCard';
import prisma from '@/lib/db';
import PostCard from './components/PostCard';
import PopularCard from './components/PopularCard';

async function getData() {
  const data = await prisma.post.findMany({
    select: {
      title: true,
      createdAt: true,
      textContent: true,
      id: true,
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
      votes: {
        select: {
          userId: true,
          voteType: true,
          postId: true,
        },
      },
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
    },
  });
  return popularCommunities;
}

export default async function Home() {
  const data = await getData();
  const popularCommunities = await getPopularCommunities();
  return (
    <div className="flex flex-col items-start sm:flex-row sm:max-w-[1000px] sm:mx-auto sm:gap-x-10 sm:mt-2 p-2">
      <div className="sm:w-[65%] flex flex-col gap-y-5">
        <CreatePostCard />
        {data.map((post) => (
          <PostCard
            subredditId={post.Subreddit?.id}
            key={post.id}
            id={post.id}
            title={post.title}
            imageString={post?.imageString as string}
            textContent={post.textContent}
            subName={post.subName as string}
            userName={post.User?.userName as string}
            voteCount={post.votes.reduce((acc, vote) => {
              if (vote.voteType === 'UP') return acc + 1;
              if (vote.voteType === 'DOWN') return acc - 1;

              return acc;
            }, 0)}
          />
        ))}
      </div>
      <div className="w-[35%] hidden flex-col gap-y-5 sm:flex ">
        <Card>
          <Image src={Banner} alt="banner" />
          <div className="p-2 flex flex-col gap-5">
            <div className="flex items-center">
              <Image
                src={HelloImage}
                alt="hello-image"
                className="w-10 h-16 -mt-7"
              />
              <h1 className="font-medium pl-3">Home</h1>
            </div>
            <p className="text-sm text-muted-foreground ">
              Your Home ThreadHive frontpage. Come here to check in with your
              favorite communities.
            </p>
            <Separator />
            <Button variant="secondary" asChild>
              <Link href={`/subreddit/haso/create`}>Create Post</Link>
            </Button>
            <Button asChild>
              <Link href={'/subreddit/create'}>Create Community</Link>
            </Button>
          </div>
        </Card>
        <Card>
          <div className="p-2 flex flex-col gap-5">
            {popularCommunities.length > 0 ? (
              popularCommunities.map((community) => (
                <PopularCard data={community} key={community.id} />
              ))
            ) : (
              <p>there is no communities</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
