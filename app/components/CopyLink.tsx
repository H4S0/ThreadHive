'use client';

import { useToast } from '@/hooks/use-toast';
import { Share } from 'lucide-react';
import React from 'react';

const CopyLink = ({
  id,
  thread,
}: {
  id: string | string[] | undefined;
  thread: string | string[] | undefined;
}) => {
  const { toast } = useToast();
  console.log(id);
  async function copytoClipboard() {
    await navigator.clipboard.writeText(
      `${location.origin}/subreddit/${thread}/${id}`
    );
    toast({
      title: 'Success',
      description: 'Your link is copied in your clipboard',
    });
  }
  return (
    <button className="flex items-center gap-1" onClick={copytoClipboard}>
      <Share className="h-4 w-4 text-muted-foreground" />
      <p className="text-muted-foreground text-sm font-medium">Share</p>
    </button>
  );
};

export default CopyLink;
