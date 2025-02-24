import { Card } from '@/components/ui/card';
import React from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ImageDown, Waypoints } from 'lucide-react';

type UserType = {
  id: string | null;
  given_name: string | null;
  family_name: string | null;
  email: string | null;
  picture: string | null;
};

const CreatePostCard = ({ user }: { user: UserType }) => {
  return (
    <Card className="px-4 py-2 flex items-center gap-x-4">
      <Waypoints className="h-12 w-fit text-primary animate-spin" />
      <Link href={user ? `/postHome` : '/api/auth/login'} className="w-full">
        <Input placeholder="Create your post" />
      </Link>

      <div>
        <Button variant="outline" size="icon" asChild>
          <Link href={'/postHome'}>
            <ImageDown className="w-6 h-6" />
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default CreatePostCard;
