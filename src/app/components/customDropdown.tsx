"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LiaUserSolid } from "react-icons/lia";
import { GrPowerShutdown } from "react-icons/gr";
import useUserStore from "../store/userStore";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  useDraggable,
} from "@heroui/react";

import Link from "next/link";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useUserStore();

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  // 使用 useDisclosure 来管理模态框的显示状态
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();

  const handleLogoutConfirm = () => {
    logout();
    onClose();
    setIsOpen(false); // 关闭下拉菜单
  };

  const targetRef = React.useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isModalOpen });

  return (
    <>
      <div
        className="relative flex-normal "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div>
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt="示例图片"
              width={45}
              height={45}
              className="w-[45px] h-[45px] cursor-pointer rounded-full "
            />
          ) : (
            <Image
              src="/assets/20.jpg"
              alt="示例图片"
              width={45}
              height={45}
              className="w-[45px] h-[45px] cursor-pointer rounded-full "
            />
          )}
        </div>
        {isOpen && (
          <div
            className="absolute cursor-pointer top-full left-0 bg-white border border-gray-300 rounded shadow-md w-[100px]"
            aria-label="Dynamic Actions"
          >
            <Link
              href="/user"
              className="p-2  cursor-pointer flex-normal text-[14px]  hover:bg-gray-100  hover:text-sky-400"
            >
              <LiaUserSolid className="mr-[2px]" />
              <p>用户中心</p>
            </Link>
            <div
              className="p-2 cursor-pointer flex-normal text-[14px] hover:bg-gray-100  hover:text-sky-400"
              onClick={onOpen}
            >
              <GrPowerShutdown className="mr-[2px]" />
              <p>退出登录</p>
            </div>
          </div>
        )}
      </div>

      {/* 模态框 */}
      <Modal ref={targetRef} isOpen={isModalOpen} onOpenChange={onClose}>
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader {...moveProps} className="flex flex-col gap-1">
                温馨提示
              </ModalHeader>
              <ModalBody>
                <p>你确定要退出当前账号吗？</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onCloseModal}>
                  取消
                </Button>
                <Button color="primary" onPress={handleLogoutConfirm}>
                  确认
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

const CustomDropdown = React.memo(Dropdown);
export default CustomDropdown;
