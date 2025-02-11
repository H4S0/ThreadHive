import prisma from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import SettingsForm from '../components/SettingsForm';

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      userName: true,
    },
  });
  return data;
}

const SettingsPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect('/api/auth/login');
  }

  const data = await getData(user.id);
  return (
    <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col mt-4">
      <SettingsForm username={data?.userName} />
    </div>
  );
};

export default SettingsPage;
