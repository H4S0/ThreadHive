'use client';

import React, { useActionState, useEffect } from 'react';
import { updateSubDescription } from '../actions';
import { Textarea } from '@/components/ui/textarea';
import SubmitButtons from './SubmitButtons';

import { useToast } from '@/hooks/use-toast';

interface formProps {
  name: string;
  description: string | null | undefined;
}

const initialState = {
  message: '',
  status: '',
};

const SubDescriptionForm = ({ name, description }: formProps) => {
  const [state, formAction] = useActionState(
    updateSubDescription,
    initialState
  );
  const { toast } = useToast();

  useEffect(() => {
    if (state?.status === 'green') {
      toast({
        title: 'Success',
        description: 'Your description was successfully updates.',
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
    <form className="mt-4" action={formAction}>
      <input type="hidden" name="subName" value={name} />
      <Textarea
        placeholder="Create your custom subreddit description"
        maxLength={120}
        name="description"
        defaultValue={description ?? undefined}
        className="mt-2 max-h-44 overflow-y-auto"
      />
      <SubmitButtons text="Save" className="mt-3 w-full" />
    </form>
  );
};

export default SubDescriptionForm;
