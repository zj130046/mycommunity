"use client";

import { Image, useDisclosure, Button, Tooltip, Card } from "@heroui/react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { RiArticleLine } from "react-icons/ri";
import { FaRegComments } from "react-icons/fa";
import { LiaCommentsSolid } from "react-icons/lia";
import { MdLogin } from "react-icons/md";
import { PiUserCirclePlus } from "react-icons/pi";
import useUserStore from "../store/userStore";
import { handleLoginSubmit, handleRegisterSubmit } from "../utils";

export default function MessageCard() {
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
  const { user, login } = useUserStore();

  const loginCard = (
    <Card className="w-[280px] shadow-lg h-[300px] mb-[20px] dark:bg-gray-900  p-[22px]">
      <div className="flex flex-col items-center">
        <div className="w-[80px] h-[80px] relative m-auto mb-[20px]">
          <Image
            src="https://irc7idfkyhk1igoi.public.blob.vercel-storage.com/uploads/1744788030352-20-JpF3TozVPGLdDF8ZJU7X9ijCbTFh48.jpg"
            alt="示例图片"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>
        <p className="mb-[20px]">你好！ 请登录</p>
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
        <div className="gradient-bg  w-[280px] h-[90px]"></div>
      </div>
    </Card>
  );

  const loggedInCard = (
    <Card className="w-[280px] shadow-lg h-[300px] mb-[20px] dark:bg-gray-900  p-[22px]">
      <div className="flex flex-col items-center">
        <div className="w-[80px] h-[80px] relative m-auto mb-[20px]">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt="示例图片"
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <Image
              src="https://irc7idfkyhk1igoi.public.blob.vercel-storage.com/uploads/1744788030352-20-JpF3TozVPGLdDF8ZJU7X9ijCbTFh48.jpg"
              alt="示例图片"
              width={80}
              height={80}
              className="rounded-full"
            />
          )}
        </div>
        <p className="mb-[20px]">{user?.username || "未登录"}</p>
        <div className="flex gap-2">
          <Tooltip content={`共${0}篇文章`} color="danger">
            <div className="flex justify-center rounded-[5px] text-[12px] w-[31.6px] h-[22.2px]  text-[#2997F7] bg-[#2997F71A]">
              <RiArticleLine className="h-[22.2px] leading-[22.2px]" />
              <p className="h-[22.2px] leading-[22.2px]">{0}</p>
            </div>
          </Tooltip>
          <Tooltip content={`共${0}条评论`} color="danger">
            <div className="flex justify-center rounded-[5px] text-[12px] w-[31.6px] h-[22.2px] text-[#18A52A] bg-[#12B9281A]">
              <FaRegComments className="h-[22.2px] leading-[22.2px]" />
              <p className="h-[22.2px] leading-[22.2px]">{0}</p>
            </div>
          </Tooltip>
          <Tooltip content={`共${0}篇帖子`} color="danger">
            <div className="flex justify-center rounded-[5px] text-[12px] w-[31.6px] h-[22.2px] text-[#5C7CFF] bg-[#4D82F91A]">
              <LiaCommentsSolid className="h-[22.2px] leading-[22.2px]" />
              <p className="h-[22.2px] leading-[22.2px]">{0}</p>
            </div>
          </Tooltip>
        </div>
        <div className="gradient-bg  w-[280px] h-[90px] mt-[25px]"></div>
      </div>
    </Card>
  );

  return (
    <div>
      {user?.username ? loggedInCard : loginCard}
      <LoginModal
        isOpen={isLoginOpen}
        onOpenChange={onLoginOpenChange}
        onRegisterOpen={onRegisterOpen}
        onSubmit={(e) => handleLoginSubmit(e, login, onLoginOpenChange)}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onOpenChange={onRegisterOpenChange}
        onLoginOpen={onLoginOpen}
        onSubmit={(e) => handleRegisterSubmit(e, onRegisterOpenChange)}
      />
    </div>
  );
}
