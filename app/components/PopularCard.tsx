import Link from 'next/link';
import React from 'react';

const PopularCard = ({ data }) => {
  return (
    <div>
      <Link href={`/subreddit/${data.name}`}>{data.name}</Link>
    </div>
  );
};

export default PopularCard;
