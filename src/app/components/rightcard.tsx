"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { FcBarChart, FcAlarmClock } from "react-icons/fc";
import { WiTime8 } from "react-icons/wi";
import { Article, NewComment } from "../store/message";
import { Image, Card } from "@heroui/react";
import { FaComments } from "react-icons/fa";
import useUserStore from "../store/userStore";
import MessageCard from "./messagecard";

export default function RightCard() {
  const text = "你好,欢迎来到悠哉社区!";
  const [visibleText, setVisibleText] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [index, setIndex] = useState(0);

  const [articlesLatest, setArticlesLatest] = useState<Article[]>([]);
  const [commentsList, setCommentsList] = useState<NewComment[]>([]);
  const { user } = useUserStore();

  const fetchData = useCallback(async () => {
    try {
      const [commentRes, articleRes] = await Promise.all([
        fetch("/api/comments/latest").then((res) => res.json()),
        fetch("/api/articles/latest").then((res) => res.json()),
      ]);

      setCommentsList(commentRes);
      setArticlesLatest(articleRes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const updateText = () => {
      if (!isRemoving) {
        if (index < text.length) {
          timeout = setTimeout(() => {
            setVisibleText((prev) => prev + text[index]);
            setIndex(index + 1);
          }, 300);
        } else {
          timeout = setTimeout(() => {
            setIsRemoving(true);
          }, 1000);
        }
      } else {
        if (index > 0) {
          timeout = setTimeout(() => {
            setVisibleText((prev) => prev.slice(0, -1));
            setIndex(index - 1);
          }, 200);
        } else {
          setIsRemoving(false);
        }
      }
    };

    updateText();

    return () => clearTimeout(timeout);
  }, [index, isRemoving, text]);

  return (
    <div>
      <Suspense fallback="<div>Loading...</div>">
        <MessageCard />
      </Suspense>
      <Card className="w-[280px] shadow-lg h-[130px] mb-[20px] dark:bg-gray-900">
        <div className="flex justify-center items-end flex-row mt-[25px] mb-[15px]">
          <FcAlarmClock className="h-[25.5px]" />
          <p className="text-[#333333] text-[17px] h-[25.5px] leading-[25.5px]">
            公告
          </p>
        </div>
        <div className="text-center text-[15px]">{visibleText}</div>
        <div className="flex-normal"></div>
      </Card>

      <Card className="w-[280px] shadow-lg h-[440px] mb-[20px] dark:bg-gray-900 p-[10px]">
        <div className="mb-[15px] flex justify-center border-b border-solid pb-[5px]">
          <FcBarChart className="h-[24px] leading-[24px] text-2xl mr-2" />

          <p className="text-[#333333] text-[17px]">最新文章</p>
        </div>
        <div>
          {articlesLatest.map((article, index) => (
            <div key={index} className="flex justify-between mb-[10px]">
              <Link
                className="w-[90px] h-[65px]"
                href={`/article/${article.slug}`}
              >
                <Image
                  src={article.img}
                  alt="示例图片"
                  width={90}
                  isZoomed
                  height={65}
                  className=" w-full h-full"
                />
              </Link>
              <div className="w-[160px] flex flex-col min-h-[65px] justify-between">
                <div className="text-[#4E5358] text-[14px] hover:text-pink-500">
                  <Link href={`/article/${article.slug}`}>{article.title}</Link>
                </div>
                <div className="text-[#B1B1B1] text-[12px] flex">
                  <WiTime8 className="h-[18px] mr-[2px]" />
                  <p>{dayjs(article.created_at).format("YYYY-MM-DD")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="w-[280px] shadow-lg dark:bg-gray-900 p-[12px]">
        <div className="flex justify-between pb-[10px] pt-[10px] items-center">
          <div className="flex justify-center">
            <FaComments className="h-[24px] leading-[24px] text-2xl mr-[8px]" />
            <p className="text-[#333333] text-[17px]">最新留言</p>
          </div>

          <div className="flex h-[12px] gap-2">
            <div className="w-[12px] h-[12px] rounded-full bg-[red]"></div>
            <div className="w-[12px] h-[12px] rounded-full bg-[blue]"></div>
            <div className="w-[12px] h-[12px] rounded-full bg-[orange]"></div>
          </div>
        </div>
        <div>
          {commentsList.map((comment, index) => (
            <div key={index} className="flex flex-col pb-[8px] border-t-1 pt-3">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center mb-[5px]">
                    <Image
                      src={comment.avatar_url || "/assets/20.jpg"}
                      alt="评论用户头像"
                      width={45}
                      height={45}
                      className="w-[45px] h-[45px] cursor-pointer rounded-full mr-[18px]"
                    />

                    <p className="ml-[5px] text-[14px] text-[#262626] mr-[4px]">
                      {comment.username}
                    </p>
                    <p className="text-[10px] bg-[red] text-[#FFFFFF] rounded-[2px] pr-[1px] pl-[1px]">
                      {user?.is_author ? "作者" : "游客"}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-[#888888] flex items-center">
                  {dayjs(comment.created_at).format("YYYY-MM-DD")}
                </div>
              </div>
              <div className="bg-[#F7F7F7] rounded-[3px]">
                <p className="text-[12px] text-[#333333] p-[5px]">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
