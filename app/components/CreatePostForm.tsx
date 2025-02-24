'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Text } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SubmitButtons from './SubmitButtons';
import { UploadDropzone } from '../utils/uploadthing';
import Image from 'next/image';
import { createPost } from '../actions';

interface SelectThreadProps {
  subreddit: { id: string; name: string }[];
}

const SelectThread = ({ subreddit }: SelectThreadProps) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<null | string>(null);
  const [textContent, setTextContent] = useState<null | string>(null);
  const [title, setTitle] = useState<null | string>(null);

  return (
    <div>
      <Select onValueChange={(value) => setSelectedThreadId(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose thread where you want to create post" />
        </SelectTrigger>
        <SelectContent>
          {subreddit.map((item) => (
            <SelectItem key={item.id} value={item.name}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Separator className="my-4" />

      <div>
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
                <input
                  type="hidden"
                  name="subName"
                  value={selectedThreadId ?? undefined}
                />
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
    </div>
  );
};

export default SelectThread;
