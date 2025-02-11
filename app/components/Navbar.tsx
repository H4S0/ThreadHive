import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import RedditText from '../../public/logo-name.svg';
import RedditMobile from '../../public/reddit-full.svg';
import {
  RegisterLink,
  LoginLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import UserDropdown from './UserDropdown';

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="h-[10vh] w-full flex items-center border-b px-5 lg:px-14 justify-between">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src={RedditMobile}
          alt="Reddit mobile icon"
          className="h-10 w-fit"
        />
        <Image
          src={RedditText}
          alt="Reddit desktop icon"
          className="w-fit h-9 hidden lg:block"
        />
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
