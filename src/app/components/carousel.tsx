import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "../store/message";

export default function Carousel() {
  const [articlesLatest, setArticlesLatest] = useState<Article[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch("/api/articles/latest");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticlesLatest(data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticle();
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex < articlesLatest.length - 1 ? prevIndex + 1 : 0
      );
    }, 3000);

    return () => clearInterval(timerId);
  }, [articlesLatest.length]);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : articlesLatest.length - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex < articlesLatest.length - 1 ? prevIndex + 1 : 0
    );
  };

  if (!isLoaded) {
    return (
      <div className="carousel bg-gray-100 animate-pulse rounded-xl mx-auto mb-[40px]">
        <div className="h-full w-full flex-normal">
          <div className="flex items-center justify-center h-full">
            <div className="loader"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-[40px] carousel">
      <div className="h-full relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
          }}
        >
          {articlesLatest.map((article) => (
            <div
              key={article.id}
              className="w-full h-full flex-shrink-0 relative "
            >
              <Link href={`/article/${article.slug}`}>
                <div className="w-full h-full">
                  <Image
                    width={1150}
                    height={400}
                    src={article.img}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 mt-4 ml-4">
                    <h4 className="text-white text-[30px]">{article.title}</h4>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          className="bg-white bg-opacity-25 backdrop-blur-sm text-black px-4 py-2 rounded-full hover:bg-opacity-30"
          onClick={handlePrev}
        >
          &lt;
        </button>
        <button
          className="bg-white bg-opacity-25 backdrop-blur-sm text-black px-4 py-2 rounded-full hover:bg-opacity-30"
          onClick={handleNext}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
