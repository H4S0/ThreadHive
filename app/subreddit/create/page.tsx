'use client';
import { createSubreddit } from '@/app/actions';
import SubmitButtons from '@/app/components/SubmitButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import React, { useActionState, useEffect } from 'react';

const initialState = {
  message: '',
  status: '',
};

const SubredditPage = () => {
  const [state, formAction] = useActionState(createSubreddit, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.status === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col mt-4">
      {' '}
      <form action={formAction}>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create Community
        </h1>
        <Separator className="my-4" />

        <div className="flex flex-col gap-2">
          <Label className="text-lg">Name</Label>
          <Label className="text-slate-500">
            Community names including capitalization cannot be changed!
          </Label>
          <Input
            placeholder="Enter the community name"
            name="name"
            className="mt-2"
          />

          <div className="flex items-center justify-start sm:justify-end gap-3 mt-5">
            <Button variant="secondary" type="button" asChild>
              <Link href={'/'}>Cancel</Link>
            </Button>
            <SubmitButtons text="Create Community" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubredditPage;
