import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThumbsDown, ThumbsUp, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import CopyLink from './CopyLink';
import { handleLike, handleDislike } from '../actions';

interface postProps {
  title: string;
  textContent: string;
  id: string;
  subName: string;
  userName: string;
  imageString: string | null | undefined;
  commentLength: number;
  createdAt: Date;
  likeNumber: number;
  disLikeNumber: number;
}

const PostCard = ({
  commentLength,
  id,
  imageString,
  textContent,
  subName,
  userName,
  title,
  likeNumber,
  disLikeNumber,
  createdAt,
}: postProps) => {
  return (
    <Card className="flex relative overflow-hidden">
      <div className="flex flex-col justify-around bg-muted p-2 h-full">
        <form action={handleLike}>
          <input type="hidden" name="postId" value={id} />
          <div className="flex items-center gap-2">
            <Button type="submit" variant="outline" size="sm">
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <p>{likeNumber}</p>
          </div>
        </form>

        <form action={handleDislike}>
          <input type="hidden" name="postId" value={id} />
          <div className="flex items-center gap-2">
            <Button type="submit" variant="outline" size="sm">
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <p>{disLikeNumber}</p>
          </div>
        </form>
      </div>

      <div>
        <div className="flex items-center gap-x-2 p-2 w-full">
          <Link
            href={`/subreddit/${subName}`}
            className="font-semibold text-xs"
          >
            threadhive/{subName}
          </Link>
          <p className="text-xs text-muted-foreground">
            Posted by: <span className="hover:text-primary">{userName}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Posted: {createdAt.toDateString()}
          </p>
        </div>

        <div className="px-2">
          <Link href={`/subreddit/${subName}/${id}`}>
            <h1 className="font-medium mt-1 text-lg">{title}</h1>
          </Link>
        </div>
        <div>
          {imageString && imageString.startsWith('http') ? (
            <Image
              src={imageString}
              alt="Post image"
              width={350}
              height={200}
              className="w-full max-h-screen p-2"
            />
          ) : (
            <p className="p-2">{textContent}</p>
          )}
        </div>
        <div className="p-2 flex items-center gap-4">
          <Link
            href={`/subreddit/${subName}/${id}`}
            className="flex items-center gap-1"
          >
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            <p className="text-muted-foreground font-medium text-sm">
              {commentLength}
            </p>
          </Link>

          <CopyLink id={id} />
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
