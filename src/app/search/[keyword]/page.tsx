"use client";

import { Card, Tabs, Tab } from "@heroui/react";
import { useState } from "react";
import useSearchStore from "@/app/store/searchStore";
import Link from "next/link";
import { Image } from "@heroui/react";
import { WiTime8 } from "react-icons/wi";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import { BiMessageDetail, BiLike } from "react-icons/bi";
import { SearchResults } from "@/app/store/message";
import Head from "next/head";

const SearchDetails = () => {
  const { searchResults } = useSearchStore();
  const [selected, setSelected] = useState<string>("帖子");
  const { articles, blogs, users } = searchResults as unknown as SearchResults;

  const handleLike = async (id: number) => {
    try {
      const response = await fetch(`/api/blog/like/${id}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("点赞失败");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className=" max-w-[840px] m-auto flex-normal">
      <Head>
        <title>这是悠哉社区搜索区</title>
        <meta name="description" content="欢迎搜索" />
      </Head>
      <Card className="p-[20px] w-full min-h-[500px] shadow-lg flex justify-start flex-col mb-[22px] dark:bg-gray-900">
        <Tabs
          aria-label="Tabs colors"
          selectedKey={selected}
          color="danger"
          radius="full"
          onSelectionChange={(e) => setSelected(String(e))}
        >
          <Tab key="帖子" title="帖子">
            {Array.isArray(blogs) && blogs.length > 0
              ? blogs.map((blog, index) => (
                  <div key={blog.id || index} className="pt-6 pb-6 border-b-1">
                    <div className="flex justify-center flex-col">
                      <div className="flex">
                        <div>
                          <Image
                            src={
                              blog.avatar_url ||
                              "https://irc7idfkyhk1igoi.public.blob.vercel-storage.com/uploads/1744788030352-20-JpF3TozVPGLdDF8ZJU7X9ijCbTFh48.jpg"
                            }
                            alt="示例图片"
                            width={45}
                            height={45}
                            className="rounded-full"
                          />
                        </div>
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="flex flex-col ml-4"
                        >
                          <p className="text-[14px]">{blog.username}</p>
                          <p className="text-[#999AAA] text-[12px]">
                            {dayjs(blog.created_at).format("YYYY-MM-DD")}
                          </p>
                        </Link>
                      </div>
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="px-14 pb-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            blog.content.length > 400
                              ? blog.content.slice(0, 400) + "..."
                              : blog.content
                          ),
                        }}
                      ></Link>
                      <div className="w-full max-h-[180px] mb-[10px] px-14">
                        {blog.img ? (
                          <Image
                            src={blog.img}
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
                            onClick={() => handleLike(blog.id)}
                          />
                          <p className="text-[#999999]">{blog.like_count}</p>
                        </div>
                        <div className="flex justify-around items-center">
                          <BiMessageDetail className="text-[22px] text-[#999999] mr-2" />
                          <p className="text-[#999999]">{blog.like_count}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : "暂无帖子数据"}
          </Tab>
          <Tab key="文章" title="文章">
            {Array.isArray(articles) && articles.length > 0
              ? articles.map((article, index) => (
                  <div
                    key={index}
                    className="flex gap-4 mb-[10px] border-b-1 pb-4"
                  >
                    <Link
                      className="w-[200px] h-[130px]"
                      href={`/article/${article.slug}`}
                    >
                      <Image
                        src={article.img}
                        alt="示例图片"
                        width={200}
                        isZoomed
                        height={130}
                        className=" w-full h-full"
                      />
                    </Link>
                    <div className="flex w-full flex-col min-h-[65px] justify-between items-start">
                      <div className="text-[18px] text-[#333333]">
                        <Link href={`/article/${article.slug}`}>
                          {article.title}
                        </Link>
                      </div>
                      <div className="text-[14px] text-[#777777]">
                        {article.excerpt.length > 130
                          ? article.excerpt.slice(0, 130) + "..."
                          : article.excerpt}
                      </div>
                      <div className="text-[#999999] text-[13px] flex">
                        <WiTime8 className="h-[18px] mr-[2px]" />
                        <p>{dayjs(article.created_at).format("YYYY-MM-DD")}</p>
                      </div>
                    </div>
                  </div>
                ))
              : "暂无文章数据"}
          </Tab>
          <Tab key="用户" title="用户">
            {Array.isArray(users) && users.length > 0
              ? users.map((user, index) => (
                  <div
                    key={index}
                    className="flex border-b-1 items-center gap-2 pt-4 pb-4"
                  >
                    <Image
                      src={
                        user.avatar_url ||
                        "https://irc7idfkyhk1igoi.public.blob.vercel-storage.com/uploads/1744788030352-20-JpF3TozVPGLdDF8ZJU7X9ijCbTFh48.jpg"
                      }
                      alt="示例图片"
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] rounded-full"
                    />
                    <p>{user.username}</p>
                  </div>
                ))
              : "暂无用户数据"}
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
};

export default SearchDetails;
