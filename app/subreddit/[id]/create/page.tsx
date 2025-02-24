'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text, Video, Waypoints } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useState } from 'react';
import { createPost } from '@/app/actions';

import SubmitButtons from '@/app/components/SubmitButtons';
import { UploadDropzone } from '@/app/utils/uploadthing';
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { rules } from '@/app/data/rules';

export default function CreatePostRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = React.use(params);
  const [imageUrl, setImageUrl] = useState<null | string>(null);
  const [textContent, setTextContent] = useState<null | string>(null);
  const [title, setTitle] = useState<null | string>(null);

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col lg:flex-row gap-x-10 mt-4 p-4">
      <div className="w-full lg:w-[65%] flex flex-col gap-y-5">
        <h1 className="font-semibold text-lg">
          Thread:{' '}
          <Link
            href={`/subreddit/${id.id}`}
            className="text-primary hover:underline"
          >
            thread/{id.id}
          </Link>
        </h1>
        <Tabs defaultValue="post" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="post"
              className="flex items-center justify-center"
            >
              <Text className="h-4 w-4 mr-2" /> Post
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="flex items-center justify-center"
            >
              <Video className="h-4 w-4 mr-2" />
              Image & Video
            </TabsTrigger>
          </TabsList>
          <TabsContent value="post">
            <Card>
              <form action={createPost}>
                <input
                  type="hidden"
                  name="imageUrl"
                  value={imageUrl ?? undefined}
                />
                <input type="hidden" name="subName" value={id.id} />
                <CardHeader>
                  <Label className="text-sm font-medium">Title</Label>
                  <Input
                    required
                    name="title"
                    placeholder="Title"
                    value={title ?? ''}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2"
                  />
                </CardHeader>
                <CardContent>
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    placeholder="create description"
                    name="textContent"
                    value={textContent ?? ''}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="mt-2 max-h-44 overflow-y-auto"
                  />
                </CardContent>
                <CardFooter>
                  <SubmitButtons text="Create Post" />
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="image">
            <Card>
              <CardHeader>
                {imageUrl === null ? (
                  <UploadDropzone
                    className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-label:text-primary ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary"
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      setImageUrl(res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      alert(error);
                    }}
                  />
                ) : (
                  <Image
                    src={imageUrl}
                    alt="uploaded image"
                    width={500}
                    height={400}
                    className="h-80 rounded-lg w-full object-contain"
                  />
                )}
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-full lg:w-[35%] mt-8 lg:mt-0">
        <Card className="flex flex-col p-4">
          <div className="flex items-center gap-x-2">
            <Waypoints className="h-12 w-fit text-primary animate-spin" />
            <h1 className="font-medium text-lg">Posting to Reddit</h1>
          </div>
          <Separator className="mt-2" />

          <div className="flex flex-col gap-y-5 mt-5">
            {rules.map((item) => (
              <div key={item.id}>
                <p className="text-sm font-medium">
                  {item.id}. {item.text}
                </p>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
