"use client";

import { memo, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Article } from "../store/message";
import { Card } from "@heroui/react";

const Component = ({ slug }: { slug: string }) => {
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await fetch(`/api/articles/all/${slug}`);
      const data = await response.json();
      setArticle(data as Article);
    };
    fetchArticle();
  }, [slug]);

  if (!article) {
    return (
      <div className="flex max-w-[1060px] m-auto items-start justify-between">
        <Card className="bg-gray-100 animate-pulse h-[500px] p-[20px] max-w-[760px] w-full shadow-lg dark:bg-gray-900"></Card>
        <Card className="bg-gray-100 animate-pulse w-[280px] shadow-lg h-[130px] dark:bg-gray-900"></Card>
      </div>
    );
  }

  const cleanContent = DOMPurify.sanitize(article.content);

  return (
    <div className="flex max-w-[1060px] m-auto items-start justify-between">
      <Card className="p-[20px] max-w-[760px] w-full shadow-lg flex justify-center items-center flex-col mb-[22px] dark:bg-gray-900">
        <div className="prose prose-lg dark:prose-invert w-full">
          <p className="text-[#00DDDD] text-[25px] m-auto text-center">
            {article.title}
          </p>
          <div
            className="w-full"
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
