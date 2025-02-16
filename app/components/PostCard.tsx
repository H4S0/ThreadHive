import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowDown, ArrowUp, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import CopyLink from './CopyLink';
import { handleVote, setJoin } from '../actions';
import SubmitButtons from './SubmitButtons';

interface postProps {
  title: string;
  textContent: string;
  id: string;
  subName: string;
  userName: string;
  imageString: string | null | undefined;
  voteCount: number;
  subredditId: string | undefined;
  isJoined: boolean;
}

const PostCard = ({
  isJoined,
  subredditId,
  id,
  imageString,
  textContent,
  subName,
  userName,
  title,
  voteCount,
}: postProps) => {
  return (
    <Card className="flex relative overflow-hidden">
      <div className="flex flex-col items-center gap-y-2 bg-muted p-2">
        <form action={handleVote}>
          <input type="hidden" name="postId" value={id} />
          <input type="hidden" name="voteDirection" value="UP" />
          <Button type="submit" variant="outline" size="sm">
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
        {voteCount}
        <form action={handleVote}>
          <input type="hidden" name="postId" value={id} />
          <input type="hidden" name="voteDirection" value="DOWN" />
          <Button type="submit" variant="outline" size="sm">
            <ArrowDown className="h-4 w-4" />
          </Button>
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
          <form action={setJoin}>
            <input type="hidden" name="subredditId" value={subredditId} />
            <SubmitButtons
              text={isJoined ? 'unjoin' : 'join'}
              className="h-6"
            />
          </form>
        </div>

        <div className="px-2">
          <Link href={'/'}>
            <h1 className="font-medium mt-1 text-lg">{title}</h1>
          </Link>
        </div>
        <div>
          {imageString && imageString.startsWith('http') ? (
            <Image
              src={imageString}
              alt="Post image"
              width={600}
              height={300}
              className="w-full h-full"
            />
          ) : (
            <p className="p-2">{textContent}</p>
          )}
        </div>
        <div className="p-2 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
            <p className="text-muted-foreground font-medium text-sm">
              31 comments
            </p>
          </div>
          <CopyLink id={id} />
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
