import Link from 'next/link';
import React from 'react';

import {
  RegisterLink,
  LoginLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import UserDropdown from './UserDropdown';
import { Waypoints } from 'lucide-react';

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="h-[10vh] w-full flex items-center border-b px-5 lg:px-14 justify-between">
      <Link href="/" className="flex items-center gap-3">
        <Waypoints className="h-10 w-fit text-primary" />
        <p className="w-fit hidden lg:block text-xl font-mono font-semibold">
          Thread<span className="text-primary">Hive</span>
        </p>
      </Link>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user ? (
          <UserDropdown profilePicture={user.picture} />
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="secondary" asChild>
              <RegisterLink>Sign up</RegisterLink>
            </Button>
            <Button asChild>
              <LoginLink>Log in</LoginLink>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
