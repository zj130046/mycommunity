"use client";

import {
  lazy,
  useEffect,
  useState,
  Suspense,
  useCallback,
  useRef,
} from "react";
import { useDisclosure } from "@heroui/react";
import { Button, Card } from "@heroui/react";
import { MdLogin } from "react-icons/md";
import useUserStore from "../store/userStore";
import Image from "next/image";
import { PiUserCirclePlus } from "react-icons/pi";
import CommentEditor from "../components/commentEditor";
import dayjs from "dayjs";
import { Comment as MessageComment } from "../store/message";
import { handleLoginSubmit, handleRegisterSubmit } from "../utils";

// 扩展Comment类型，增加parent_id和reply_to属性
interface Comment extends MessageComment {
  parent_id?: number | null;
  reply_to?: number | null;
  children?: Comment[];
}

const LoginModal = lazy(() => import("../components/LoginModal"));
const RegisterModal = lazy(() => import("../components/RegisterModal"));

interface ClientComponentProps {
  initialComments: Comment[];
}

function CommentItem({
  comment,
  allComments,
  onLike,
  fetchComments,
  notifyWS,
}: {
  comment: Comment;
  allComments: Comment[];
  onLike: (id: number) => void;
  fetchComments: () => void;
  notifyWS: () => void;
}) {
  const [showReply, setShowReply] = useState(false);
  // 获取被回复对象
  let replyToUser = "";
  if (comment.reply_to && comment.reply_to !== comment.parent_id) {
    const target = allComments.find((c) => c.id === comment.reply_to);
    if (target) replyToUser = target.username;
  }
  // 计算parentId和replyTo
  const parentId = comment.parent_id ? comment.parent_id : comment.id;
  const replyTo = comment.id;
  return (
    <div className="mb-2">
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
            {replyToUser ? (
              <span className="text-blue-500">
                {comment.username} 回复 {replyToUser}：
              </span>
            ) : null}
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
          parentId={parentId}
          replyTo={replyTo}
          onCommentSubmit={() => {
            fetchComments();
            setShowReply(false);
            notifyWS();
          }}
        />
      )}
    </div>
  );
}

export default function ClientComponent({
  initialComments,
}: ClientComponentProps) {
  const { user, login } = useUserStore();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [pendingLike, setPendingLike] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

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

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch("/api/comments");
      if (!res.ok) throw new Error("获取评论失败");
      const data = await res.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  }, []);

  // WebSocket连接
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");
    wsRef.current = ws;
    ws.onmessage = () => {
      fetchComments();
    };
    return () => {
      ws.close();
    };
  }, [fetchComments]);

  // 通知WebSocket服务端
  const notifyWS = () => {
    if (wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send("update");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleLike = useCallback(
    async (commentId: number) => {
      if (!user) {
        onLoginOpen();
        setPendingLike(commentId);
        return;
      }

      try {
        const res = await fetch(`/api/comments/like/${commentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.userId }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "点赞失败");
          return;
        }
        fetchComments();
        notifyWS(); // 新增
      } catch {
        alert("点赞失败");
      }
    },
    [user, onLoginOpen, fetchComments]
  );

  // 登录后自动点赞
  useEffect(() => {
    if (user && pendingLike) {
      handleLike(pendingLike);
      setPendingLike(null);
    }
  }, [user, pendingLike, handleLike]);

  // 展开所有评论为flatList
  function flatten(comments: Comment[]): Comment[] {
    let arr: Comment[] = [];
    comments.forEach((c) => {
      arr.push(c);
      if (c.children && c.children.length > 0) {
        arr = arr.concat(flatten(c.children));
      }
    });
    return arr;
  }
  const flatList = flatten(comments);

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
            <div key={comment.id} className="mb-2">
              <CommentItem
                comment={comment}
                allComments={flatList}
                onLike={handleLike}
                fetchComments={fetchComments}
                notifyWS={notifyWS}
              />
              {/* 子评论区，所有子评论都在同一列 */}
              {comment.children && comment.children.length > 0 && (
                <div className="ml-8 mt-2">
                  {comment.children.map((child) => (
                    <CommentItem
                      key={child.id}
                      comment={child}
                      allComments={flatList}
                      onLike={handleLike}
                      fetchComments={fetchComments}
                      notifyWS={notifyWS}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
