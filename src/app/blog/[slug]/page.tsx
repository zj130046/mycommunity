"use client";

import { useParams } from "next/navigation";
import { lazy, Suspense } from "react";
import DOMPurify from "dompurify";
import { Card } from "@heroui/react";
import { Image } from "@heroui/react";
import dayjs from "dayjs";
import { Blog } from "@/app/store/message";
import { BiMessageDetail, BiLike } from "react-icons/bi";
import useFetchDetailData from "@/app/hooks/useFetchDetailData";

const MessageCard = lazy(() => import("@/app/components/messagecard"));

const BlogDetails = () => {
  const { slug } = useParams();

  const { data } = useFetchDetailData<Blog>(`/api/blog/all/${slug}`);
  const handleLike = async (id) => {
    try {
      const response = await fetch(`/api/blog/like/${id}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("点赞失败");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!data) {
    return (
      <div className="flex w-full max-w-[1040px] m-auto items-start justify-between">
        <Card className="bg-gray-100 animate-pulse w-full max-w-[730px] shadow-lg dark:bg-gray-900"></Card>
        <Card className="bg-gray-100 animate-pulse w-[280px] shadow-lg h-[300px] dark:bg-gray-900"></Card>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[1040px] m-auto items-start justify-between">
      <div>
        <Card className="p-[20px] w-[730px] shadow-lg flex justify-center flex-col mb-[22px] dark:bg-gray-900">
          <div className="pt-6 pb-6 border-b-1">
            <div className="flex justify-center flex-col">
              <div className="flex">
                <div>
                  <Image
                    src={
                      data.avatar_url ||
                      "https://irc7idfkyhk1igoi.public.blob.vercel-storage.com/uploads/1744788030352-20-JpF3TozVPGLdDF8ZJU7X9ijCbTFh48.jpg"
                    }
                    alt="示例图片"
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col ml-4">
                  <p className="text-[14px]">{data.username}</p>
                  <p className="text-[#999AAA] text-[12px]">
                    {dayjs(data.created_at).format("YYYY-MM-DD")}
                  </p>
                </div>
              </div>
              <div
                className="px-14 pb-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data.content),
                }}
              ></div>
              <div className="w-full max-h-[180px] mb-[10px] px-14">
                {data.img ? (
                  <Image
                    src={data.img}
                    alt="示例图片"
                    width={900}
                    height={180}
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-around">
                <div className="flex justify-around">
                  <BiLike
                    className="text-[22px] text-[#999999] mr-2"
                    onClick={() => handleLike(data.id)}
                  />
                  <p className="text-[#999999]">{data.like_count}</p>
                </div>
                <div className="flex justify-around items-center">
                  <BiMessageDetail className="text-[22px] text-[#999999] mr-2" />
                  <p className="text-[#999999]">{data.like_count}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Suspense
        fallback={
          <Card className="bg-gray-100 animate-pulse w-[280px] shadow-lg h-[300px] dark:bg-gray-900"></Card>
        }
      >
        <MessageCard />
      </Suspense>
    </div>
  );
};

export default BlogDetails;
