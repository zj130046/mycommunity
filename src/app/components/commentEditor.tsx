"use client";

import { useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@heroui/react";
import { RiEmotionLine } from "react-icons/ri";
import useUserStore from "../store/userStore";
import { $getRoot, $getSelection, $isRangeSelection } from "lexical";
import { emojiList } from "../store/message";

import useDebounce from "../hooks/useDebounce";

const EmojiButton = () => {
  const [editor] = useLexicalComposerContext(); //获取当前编辑器实例
  const [showPicker, setShowPicker] = useState(false);
  return (
    <div className="relative">
      <button
        className="mt-2 p-2 border rounded-md flex items-center text-[#888888] "
        onClick={() => setShowPicker(!showPicker)}
      >
        <RiEmotionLine />
        <p>表情</p>
      </button>
      {showPicker && (
        <div className="w-[200px] absolute top-15 left-0 bg-white shadow-md p-2 rounded-md grid grid-cols-6">
          {emojiList.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                editor.update(() => {
                  //用于修改编辑器内容
                  const selection = $getSelection(); //获取当前光标选区
                  if ($isRangeSelection(selection)) {
                    //检查是否是文本选区
                    selection.insertText(emoji); //在光标处插入表情
                  }
                });
                setShowPicker(false);
              }}
              className="text-xl p-1 z-1000"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function CommentEditor({ onCommentSubmit, parentId = null }) {
  const [editorContent, setEditorContent] = useState("");
  const { user } = useUserStore();
  const comment = {
    userId: user?.userId,
    avatarUrl: user?.avatarUrl,
    username: user?.username,
    content: editorContent,
    parentId, // 新增
  };

  const submit = async () => {
    try {
      const response = await fetch("/api/comments/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });
      if (!response.ok) {
        throw new Error("error");
      }
      if (typeof onCommentSubmit === "function") {
        onCommentSubmit();
      }
      setEditorContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedsubmit = useDebounce(submit, 500);

  return (
    //初始化
    <LexicalComposer
      initialConfig={{
        namespace: "CommentEditor",
        theme: { paragraph: "text-gray-700 p-2" },
        onError: (error) => console.error(error),
      }}
    >
      {/* 富文本编辑区域 */}
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="border p-2 rounded-md w-full" />
        }
      />
      <div className="flex justify-between">
        <EmojiButton />
        <Button
          className="mt-2 p-2 bg-blue-500 text-white rounded-md"
          onClick={() => debouncedsubmit()}
        >
          提交评论
        </Button>
      </div>

      <EditorChangeListener onChange={(e) => setEditorContent(e)} />
    </LexicalComposer>
  );
}

// 监听 LexicalEditor 内容变化
const EditorChangeListener = ({
  onChange,
}: {
  onChange: (content: string) => void;
}) => {
  const [editor] = useLexicalComposerContext();

  editor.registerUpdateListener(({ editorState }) => {
    //监听编辑器内容变化
    editorState.read(() => {
      const text = $getRoot().getTextContent(); //获取纯文本（不含 HTML 标签）
      onChange(text);
    });
  });

  return null;
};
