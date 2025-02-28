"use client";

import { memo, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Article } from "../store/message";
import { CircularProgress, Card } from "@heroui/react";

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
    return <CircularProgress aria-label="Loading..." />;
  }

  const cleanContent = DOMPurify.sanitize(article.content);

  return (
    <div className="flex max-w-[1150px] m-auto items-start justify-between">
      <Card className="p-[20px] max-w-[840px] w-full shadow-lg flex justify-center flex-col mb-[22px] dark:bg-gray-900">
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
