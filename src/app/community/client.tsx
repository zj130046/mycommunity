"use client";

import {
  lazy,
  useEffect,
  useState,
  Suspense,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { IoMdPaperPlane } from "react-icons/io";
import { useDisclosure, Button, Card, Image } from "@heroui/react";
import useUserStore from "../../app/store/userStore";
import { MdLogin } from "react-icons/md";
import { PiUserCirclePlus } from "react-icons/pi";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import Link from "next/link";
import { handleLoginSubmit, handleRegisterSubmit } from "../utils";
import { Blog } from "../store/message";
import { BiMessageDetail, BiLike } from "react-icons/bi";
import { uploadFile } from "../utils";
import useDebounce from "../hooks/useDebounce";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const MyEditor = lazy(() => import("@/app/components/editor"));
const LoginModal = lazy(() => import("../components/LoginModal"));
const RegisterModal = lazy(() => import("../components/RegisterModal"));

interface ClientComponentProps {
  initialBlogs: Blog[];
}

export default function ClientComponent({
  initialBlogs,
}: ClientComponentProps) {
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onOpenChange: onLoginOpenChange,
  } = useDisclosure();
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onOpenChange: onRegisterOpenChange,
  } = useDisclosure();

  const router = useRouter();
  const { user, login, token } = useUserStore();
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const listRef = useRef<List>(null);

  // 计算每项高度的函数
  const getItemSize = useCallback(
    (index: number) => {
      const blog = blogs[index];
      if (!blog) return 300; // 默认高度

      let height = 180; // 基础高度（用户信息+间距）

      // 内容高度（每100字符增加20px）
      const contentHeight = Math.ceil(blog.content.length / 100) * 20;
      height += Math.min(contentHeight, 200); // 限制最大内容高度

      if (blog.img) height += 200;

      // 底部操作栏高度
      height += 50;

      return height;
    },
    [blogs]
  );

  // 当 blogs 数据更新后，强制让虚拟列表重新计算每一项的高度和位置，从第 0 项开始
  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0); //VariableSizeList 组件自带的方法
    }
  }, [blogs]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setFile(file);
    setImg(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    let imageUrl = img;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("文件大小不能超过 5MB，请选择更小的文件。");
        return;
      }
      imageUrl = await uploadFile(file);
      if (!imageUrl) return;
    }

    if (!token) {
      console.error("未找到 JWT，请重新登录");
      return;
    }
    const data = {
      content,
      img: imageUrl,
      avatarUrl: user?.avatarUrl,
      username: user?.username,
    };
    const response = await fetch("/api/blog/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    setContent("");
    setImg("");
    const result = await response.json();
    if (response.ok) {
      alert("帖子发布成功");
    } else {
      alert(result.message);
    }
  };

  const debouncedHandleSubmit = useDebounce(handleSubmit, 500);

  const handleLike = async (id: number) => {
    try {
      const response = await fetch(`/api/blog/like/${id}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("点赞失败");
      }
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === id
            ? { ...blog, like_count: blog.like_count + 1, liked: true }
            : blog
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const loginCard = (
    <Card className="h-[500px] shadow-lg w-full mb-[12px] dark:bg-gray-900 p-[22px]">
      <div className="flex flex-col items-center m-auto">
        <p className="mt-[20px] mb-[20px] text-[16.8px] text-[#B1B1B1] text-center">
          你好,请先登录！
        </p>
        <div className="flex gap-2 mb-[20px]">
          <li className="flex-normal">
            <Button
              radius="full"
              size="sm"
              color="primary"
              onPress={onLoginOpen}
            >
              <MdLogin className="mr-[-4px]" />
              <p>登录</p>
            </Button>
          </li>
          <li className="flex-normal">
            <Button
              radius="full"
              size="sm"
              color="success"
              onPress={onRegisterOpen}
            >
              <PiUserCirclePlus className="mr-[-4px]" />
              <p>注册</p>
            </Button>
          </li>
        </div>
      </div>
    </Card>
  );

  const loggedInCard = (
    <Card className="p-[16px] w-full shadow-lg flex items-center flex-col min-h-[200px] mb-[12px] dark:bg-gray-900">
      <Suspense fallback={<div>Loading editor...</div>}>
        <MyEditor
          defaultContent={content}
          onChange={(html) => setContent(html)}
        />
      </Suspense>

      <label
        htmlFor="coverUpload"
        className="relative mb-[10px] flex-normal h-20 w-full border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
      >
        <input
          type="file"
          id="coverUpload"
          className="absolute opacity-0 w-full h-full cursor-pointer"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
        />
        {img ? (
          <div className="w-full h-[76px]">
            <Image
              src={img}
              alt="封面预览"
              width={1000}
              height={76}
              className="h-full w-full object-cover rounded-md"
            />
          </div>
        ) : (
          <span className="text-gray-500">添加帖子封面</span>
        )}
      </label>
      <Button color="primary" onClick={debouncedHandleSubmit}>
        <IoMdPaperPlane />
        发布帖子
      </Button>
    </Card>
  );

  const BlogRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const blog = blogs[index];
      return (
        <div
          key={blog.id}
          style={style}
          className="cursor-pointer p-[24px] w-full flex dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex justify-center flex-col w-full">
            <div className="flex">
              <Link href={`/blog/${blog.slug}`}>
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
              </Link>
              <div className="flex flex-col ml-4">
                <p className="text-[14px]">{blog.username}</p>
                <p className="text-[#999AAA] text-[12px]">
                  {dayjs(blog.created_at).format("YYYY-MM-DD")}
                </p>
              </div>
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

            {blog.img && (
              <div className="w-full max-h-[180px] mb-[10px] px-14">
                <Image
                  src={blog.img}
                  alt="示例图片"
                  width={900}
                  height={180}
                  className="w-full h-auto max-h-[180px] object-contain"
                />
              </div>
            )}
            <div className="flex justify-around mt-4">
              <div className="flex items-center">
                <BiLike
                  className={`text-[22px] mr-2 cursor-pointer ${
                    blog.liked ? "text-blue-500" : "text-[#999999]"
                  }`}
                  onClick={() => handleLike(blog.id)}
                />
                <p className="text-[#999999]">{blog.like_count}</p>
              </div>
              <div className="flex items-center">
                <BiMessageDetail className="text-[22px] text-[#999999] mr-2" />
                <p className="text-[#999999]">{blog.comment_count || 0}</p>
              </div>
            </div>
          </div>
        </div>
      );
    },
    [blogs]
  );

  return (
    <div className="community-content">
      <Card className="left w-[100px] h-[300px] shadow-lg dark:bg-gray-900"></Card>
      <div className="w-[730px]">
        {user?.username ? loggedInCard : loginCard}
        <Card className="w-full b-[100px] dark:bg-gray-900">
          <div className="w-full h-[calc(100vh-300px)]">
            <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={listRef}
                  height={height}
                  width={width}
                  itemCount={blogs.length}
                  itemSize={getItemSize}
                  estimatedItemSize={300}
                >
                  {BlogRow}
                </List>
              )}
            </AutoSizer>
          </div>
        </Card>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginModal
          isOpen={isLoginOpen}
          onOpenChange={onLoginOpenChange}
          onRegisterOpen={onRegisterOpen}
          onSubmit={(e) => handleLoginSubmit(e, login, onLoginOpenChange)}
        />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterModal
          isOpen={isRegisterOpen}
          onOpenChange={onRegisterOpenChange}
          onLoginOpen={onLoginOpen}
          onSubmit={(e) => handleRegisterSubmit(e, onRegisterOpenChange)}
        />
      </Suspense>

      <Card className="flex flex-col navmedia w-[280px] shadow-lg h-[300px] mb-[20px] dark:bg-gray-900 p-[22px]">
        <div className="flex flex-col items-center">
          <div className="w-[100px] h-[100px] relative m-auto mb-[20px]">
            <Image
              src="/assets/22.jpg"
              alt="示例图片"
              width={100}
              height={100}
              className="w-[100px] h-[100px]"
            />
          </div>
          <p className="mb-[10px] text-[16px] ">博客投稿</p>
          <p className="mb-[20px] text-[12.6px] text-[#999999]">
            这里投稿您的文章,将会展示在博客首页
          </p>
          <Button color="success" onClick={() => router.push("/blog")}>
            发布文章
          </Button>
        </div>
      </Card>
    </div>
  );
}
