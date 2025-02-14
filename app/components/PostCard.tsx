import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface postProps {
  title: string;
  jsonContent: any;
  id: string;
  subName: string;
  userName: string;
  imageString: string | null | undefined;
}

const PostCard = ({
  id,
  imageString,
  jsonContent,
  subName,
  userName,
  title,
}: postProps) => {
  return (
    <Card className="flex relative overflow-hidden">
      <div className="flex flex-col items-center gap-y-2 bg-muted p-2">
        <form>
          <Button variant="outline" size="sm">
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
        0
        <form>
          <Button variant="outline" size="sm">
            <ArrowDown className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div>
        <div className="flex items-center gap-x-2 p-2">
          <Link
            href={`/subreddit/${subName}`}
            className="font-semibold text-xs"
          >
            subreddit/{subName}
          </Link>
          <p className="text-xs text-muted-foreground">
            Posted by: <span className="hover:text-primary">{userName}</span>
          </p>
        </div>

        <div className="px-2">
          <Link href={'/'}>
            <h1 className="font-medium mt-1 text-lg">{title}</h1>
          </Link>
        </div>
        <div>
          {imageString && imageString.startsWith('http') && (
            <Image
              src={imageString}
              alt="Post image"
              width={600}
              height={300}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
