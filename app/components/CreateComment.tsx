'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { createComment } from '../actions';

const CreateComment = ({ postId }: any) => {
  const [comment, setComment] = useState<string | null>(null);

  return (
    <form action={createComment} className="mt-4">
      <input type="hidden" name="postId" value={postId} />
      <Label>Comment</Label>
      <Textarea
        placeholder="Create your comment"
        name="comment"
        value={comment ?? undefined}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button variant="secondary" className="mt-2" type="submit">
        Post comment
      </Button>
    </form>
  );
};

export default CreateComment;
