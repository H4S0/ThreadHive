import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React from 'react';

interface popularProps {
  name: string;
  members: number;
}

const PopularCard = ({ data }: { data: popularProps }) => {
  return (
    <div className="flex flex-col">
      <Link href={`/subreddit/${data.name}`} className="font-medium">
        thread/{data.name}
      </Link>
      <p className="text-sm">
        Members: <span className="text-primary font-bold">{data.members}</span>
      </p>
      <Separator className="mt-2" />
    </div>
  );
};

export default PopularCard;
