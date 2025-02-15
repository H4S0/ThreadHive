'use client';

import { useToast } from '@/hooks/use-toast';
import { Share } from 'lucide-react';
import React from 'react';

const CopyLink = ({ id }: { id: string }) => {
  const { toast } = useToast();
  async function copytoClipboard() {
    await navigator.clipboard.writeText(`${location.origin}/post/${id}`);
    toast({
      title: 'Success',
      description: 'Your link is copied in your clipboard',
    });
  }
  return (
    <button className="flex items-center gap-1" onClick={copytoClipboard}>
      <Share className="h-4 w-4 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">Share</p>
    </button>
  );
};

export default CopyLink;
