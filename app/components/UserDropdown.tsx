import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MenuIcon } from 'lucide-react';
import React from 'react';
import defaultImage from '../../public/download.png';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

interface DropdownProps {
  profilePicture: string | null;
}

const UserDropdown = ({ profilePicture }: DropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt="User profile picture"
              width={32}
              height={32}
              className="rounded-full lg:block hidden"
            />
          ) : (
            <Image
              src={defaultImage}
              alt="Default image"
              className="h-8 w-8 rounded-full lg:block hidden"
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem>
          <Link href="/r/create" className="w-full">
            Create Community
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/create" className="w-full">
            Create Post
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings" className="w-full">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button asChild className="w-full">
            <LogoutLink>Logout</LogoutLink>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
