'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useFormStatus } from 'react-dom';

interface submitButtons {
  text: string;
  className?: string;
}

const SubmitButtons = ({ text, className }: submitButtons) => {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled className={className}>
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button type="submit" className={className}>
          {text}
        </Button>
      )}
    </>
  );
};

export default SubmitButtons;
