import { Card } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import pfp from '../../public/pfp.png';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ImageDown } from 'lucide-react';

const CreatePostCard = () => {
  return (
    <Card className="px-4 py-2 flex items-center gap-x-4">
      <Image src={pfp} alt="pfp" className="h-12 w-fit" />
      <Link href={`/subreddit/haso/create`} className="w-full">
        <Input placeholder="Create your post" />
      </Link>

      <div>
        <Button variant="outline" size="icon" asChild>
          <Link href={'/subreddit/haso/create'}>
            <ImageDown className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default CreatePostCard;
