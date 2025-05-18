"use client";

import { lazy, useEffect, useRef, useState, Suspense } from "react";
import { useDisclosure } from "@heroui/react";
import { Button, Card } from "@heroui/react";
import { MdLogin } from "react-icons/md";
import useUserStore from "../store/userStore";
import Image from "next/image";
import { PiUserCirclePlus } from "react-icons/pi";
import CommentEditor from "../components/commentEditor";
import dayjs from "dayjs";
import { Comment } from "../store/message";
import { handleLoginSubmit, handleRegisterSubmit } from "../utils/page";

const LoginModal = lazy(() => import("../components/LoginModal"));
const RegisterModal = lazy(() => import("../components/RegisterModal"));

interface ClientComponentProps {
  initialComments: Comment[];
}

function CommentItem({ comment, onReply, onLike, replyingId, fetchComments }) {
  const [showReply, setShowReply] = useState(false);
  return (
    <div className="mb-2 pl-4 border-l">
      <div className="flex items-start">
        <Image
          src={
            comment.avatar_url ||
            "https://irc7idfkyhk1igoi.public.blob.vercel-storage.com/uploads/1744788030352-20-JpF3TozVPGLdDF8ZJU7X9ijCbTFh48.jpg"
          }
          alt="评论用户头像"
          width={45}
          height={45}
          className="w-[45px] h-[45px] rounded-full mr-[18px]"
        />
        <div>
          <p className="text-[15px] mb-[3px]">{comment.username}</p>
          <p className="text-[14px] mb-[8px] text-[#4E5358]">
            {comment.content}
          </p>
          <p className="text-[14px] text-[#999999]">
            {dayjs(comment.created_at).format("YYYY-MM-DD")}
          </p>
        </div>
      </div>
      <div>
        <span
          onClick={() => setShowReply(!showReply)}
          className="cursor-pointer text-blue-500"
        >
          回复
        </span>
        <span
          onClick={() => onLike(comment.id)}
          className="ml-2 cursor-pointer"
        >
          👍 {comment.like_count}
        </span>
      </div>
      {showReply && (
        <CommentEditor
          parentId={comment.id}
          onCommentSubmit={() => {
            fetchComments();
            setShowReply(false);
          }}
        />
      )}
      {comment.children && comment.children.length > 0 && (
        <div className="ml-4">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              onReply={onReply}
              onLike={onLike}
              replyingId={replyingId}
              fetchComments={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClientComponent({
  initialComments,
}: ClientComponentProps) {
  const { user, login } = useUserStore();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const commentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const sizeMap = useRef<{ [key: number]: number }>({});

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

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments");
      if (!res.ok) throw new Error("点赞失败");
      const data = await res.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    comments.forEach((comment) => {
      const el = commentRefs.current[comment.id]; //保存着所有评论对应的 DOM 元素引用
      if (el) {
        const height = el.getBoundingClientRect().height; // 获取元素在页面中的真实高度
        sizeMap.current[comment.id] = height;
      }
    });
  }, [comments]);

  const handleLike = async (commentId: number) => {
    const res = await fetch(`/api/comments/like/${commentId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to like comment");
    fetchComments();
  };

  const loginCard = (
    <Card className="w-full shadow-lg h-[180px] mb-[20px] bg-[#74747414] dark:bg-gray-900 p-[22px]">
      <div className="flex flex-col items-center">
        <p className="mt-[20px] mb-[20px] text-[16.8px] text-[#B1B1B1]">
          请登录后发表评论
        </p>
        <div className="flex gap-2 mb-[20px]">
          <Button radius="full" size="sm" color="primary" onPress={onLoginOpen}>
            <MdLogin className="mr-[-4px]" />
            <p>登录</p>
          </Button>
          <Button
            radius="full"
            size="sm"
            color="success"
            onPress={onRegisterOpen}
          >
            <PiUserCirclePlus className="mr-[-4px]" />
            <p>注册</p>
          </Button>
        </div>
      </div>
    </Card>
  );

  const loggedInCard = (
    <div className="w-full flex gap-5 shadow-lg mb-[20px] dark:bg-gray-900 p-[22px]">
      <div className="w-[45px] flex flex-col items-center">
        <Image
          src={
            user?.avatarUrl ||
            "https://irc7idfkyhk1igoi.public.blob.vercel-storage.com/uploads/1744788030352-20-JpF3TozVPGLdDF8ZJU7X9ijCbTFh48.jpg"
          }
          alt="用户头像"
          width={45}
          height={45}
          className="w-[45px] h-[45px] cursor-pointer rounded-full"
        />
        <p className="mb-[20px]">{user?.username || "未登录"}</p>
      </div>
      <div className="w-full">
        <CommentEditor onCommentSubmit={fetchComments} />
      </div>
    </div>
  );

  return (
    <Card className="w-full shadow-lg p-[15px] flex items-center flex-col dark:bg-gray-900 mb-[100px]">
      {user ? loggedInCard : loginCard}

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

      <div className="p-[10px] w-full">
        <p className="text-[18px] text-[#1A1A1A] mb-[5px]">评论列表</p>
        <div className="w-full">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={() => {}}
              onLike={handleLike}
              fetchComments={fetchComments}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
