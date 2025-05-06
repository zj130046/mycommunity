"use client";

import { memo } from "react";
import DOMPurify from "dompurify";
import { Article } from "../store/message";
import { Card } from "@heroui/react";
import useFetchDetailData from "../hooks/useFetchDetailData";

const Component = ({ slug }: { slug: string }) => {
  const { data } = useFetchDetailData<Article>(`/api/articles/all/${slug}`);

  if (!data) {
    return (
      <div className="flex max-w-[1060px] m-auto items-start justify-between">
        <Card className="bg-gray-100 animate-pulse h-[500px] p-[20px] max-w-[760px] w-full shadow-lg dark:bg-gray-900"></Card>
        <Card className="bg-gray-100 animate-pulse w-[280px] shadow-lg h-[130px] dark:bg-gray-900"></Card>
      </div>
    );
  }

  const cleanContent = DOMPurify.sanitize(data.content); //防止 XSS 攻击，确保富文本内容安全渲染

  return (
    <div className="flex max-w-[1060px] m-auto items-start justify-between">
      <Card className="p-[20px] max-w-[760px] w-full shadow-lg flex justify-center items-center flex-col mb-[22px] dark:bg-gray-900">
        <div className="prose prose-lg dark:prose-invert w-full">
          <p className="text-[#00DDDD] text-[25px] m-auto text-center">
            {data.title}
          </p>
          <div
            className="w-full"
            //dangerouslySetInnerHTML 是 React 中唯一允许直接插入 HTML 的方式，
            // 但必须严格遵守安全规范
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          ></div>
        </div>
      </Card>
      <Card className="w-[280px] shadow-lg h-[130px] mb-[20px] dark:bg-gray-900"></Card>
    </div>
  );
};

const ClientComponent = memo(Component);
export default ClientComponent;
