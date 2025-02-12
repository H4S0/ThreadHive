'use client';

import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import pfp from '../../../../public/pfp.png';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TipTapEditor } from '@/app/components/TipTap';
import SubmitButtons from '@/app/components/SubmitButtons';
import { UploadDropzone } from '@/app/utils/uploadthing';

const rules = [
  {
    id: 1,
    text: 'Remember the human',
  },
  {
    id: 2,
    text: 'Behave like you would in real life',
  },
  {
    id: 3,
    text: 'Look for the original source of content',
  },
  {
    id: 4,
    text: 'Search for duplication before posting',
  },
  {
    id: 5,
    text: 'Read the community guidlines',
  },
];

const CreatePostRoute = ({ params }: { params: Promise<{ id: string }> }) => {
  const name = React.use(params);
  return (
    <div className="max-w-[1000px] mx-auto gap-x-10 mt-4 flex">
      <div className="w-[65%] flex flex-col gap-y-5">
        <h1 className="font-semibold">
          Subreddit:{' '}
          <Link href={`/subreddit/${name.id}`} className="text-primary">
            {name.id}
          </Link>
        </h1>
        <Tabs defaultValue="post" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="post">
              <Text className="mr-2 h-4 w-4" />
              Post
            </TabsTrigger>
            <TabsTrigger value="image">
              <Video className="mr-2 h-4 w-4" /> Images & Video
            </TabsTrigger>
          </TabsList>
          <TabsContent value="post">
            <Card>
              <form>
                <CardHeader>
                  <Label>Title</Label>
                  <Input required name="title" placeholder="Title" />
                  <TipTapEditor />
                </CardHeader>
                <CardFooter>
                  <SubmitButtons text="Create Post" />
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="image">
            <Card>
              <CardHeader>
                <UploadDropzone
                  className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-label:text-primary ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    console.log(res);
                  }}
                  onUploadError={(error: Error) => {
                    alert('Error');
                  }}
                />
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-[35%]">
        <Card className="flex flex-col p-4">
          <div className="flex items-center gap-2">
            <Image src={pfp} alt="pfp" className="h-10 w-10" />
            <h1 className="font-medium">Posting to ThreadHive</h1>
          </div>
          <Separator className="mt-2" />
          <div className="flex flex-col gap-y-5 mt-5">
            {rules.map((item) => (
              <div key={item.id}>
                <p className="text-small font-medium">
                  {item.id}.{item.text}
                </p>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreatePostRoute;
