"use client";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import "@wangeditor/editor/dist/css/style.css";
import React, { useEffect, useState } from "react";

export interface IRichTextProps {
  defaultContent?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
}

export default function MyEditor(props: IRichTextProps) {
  const { defaultContent = "", onChange } = props;
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState(defaultContent);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setHtml(defaultContent); // 每次父组件传递新内容时，更新本地html状态
  }, [defaultContent]);

  const toolbarConfig: Partial<IToolbarConfig> = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容",
    MENU_CONF: {
      uploadImage: {
        server: "/api/upload", // 上传接口
        fieldName: "file", // 字段名，和后端一致
        maxFileSize: 5 * 1024 * 1024, // 最大5M，可自定义
        allowedFileTypes: ["image/*"], // 只允许图片类型
        // 上传成功后插入编辑器
        customInsert(
          res: { url: string },
          insertFn: (url: string, alt: string, href?: string) => void
        ) {
          // res 是后端返回的数据
          insertFn(res.url, "", res.url.split("/").pop()); // 插入图片
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    };
  }, [editor]);

  const handleChange = (editor: IDomEditor) => {
    const h = editor.getHtml();
    setHtml(h);
    if (onChange) {
      onChange(h);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-[150px] border border-gray-300 p-2">加载中...</div>
    );
  }

  return (
    <div style={{ zIndex: 100 }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: "1px solid #ccc", borderTop: "1px solid #ccc" }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={handleChange}
        mode="default"
        className="min-h-[150px]"
      />
    </div>
  );
}
