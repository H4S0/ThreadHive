'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React, { useActionState, useEffect } from 'react';
import { updateUsername } from '../actions';
import SubmitButtons from './SubmitButtons';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: '',
  status: '',
};

const SettingsForm = ({
  username,
}: {
  username: string | null | undefined;
}) => {
  const [state, formAction] = useActionState(updateUsername, initialState);
  const { toast } = useToast();

  useEffect(() => {
    console.log('State changed:', state); // Debugging log

    if (state?.status === 'green') {
      toast({
        title: 'Success',
        description: 'Your username has been updated.',
      });
    } else if (state?.status === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <Label className="text-lg">Username</Label>
        <Label className="text-slate-500">
          In this Settings page you can change your username!
        </Label>
        <Input
          defaultValue={username ?? undefined}
          name="username"
          className="mt-2"
        />

        {state?.status === 'error' && (
          <p className="text-destructive mt-1">{state.message}</p>
        )}

        <div className="flex items-center justify-start sm:justify-end gap-3 mt-5">
          <Button variant="secondary" type="button" asChild>
            <Link href={'/'}>Cancel</Link>
          </Button>
          <SubmitButtons />
        </div>
      </div>
    </form>
  );
};

export default SettingsForm;
