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
  const { defaultContent = "", placeholder = "请输入内容", onChange } = props;
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
  const editorConfig: Partial<IEditorConfig> = { placeholder };

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
