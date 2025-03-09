import { useState } from "react";
import ReactQuill from "react-quill";
import { EditorToolbars } from ".";
import { formats, modules } from "./EditorToolbars";

interface EditorProps {
  setValue: (name: string, content: string) => void;
  errors: any;
  name: string;
  placeholder?: string;
  initialContent?: string;
}
const Editor = ({
  setValue,
  errors,
  name,
  placeholder = "Write something awesome...",
  initialContent = "",
}: EditorProps) => {
  const [content, setContent] = useState(initialContent);
  const editorStyle = {
    // maxheight: '500px',
    // minheight: '500px',
    height: "500px",
    // overFlow: 'auto',

    // set the height to 500 pixels
  };
  const onSetContent = (content: string) => {
    setContent(content);
    setValue(name, content);
  };

  return (
    <>
      <EditorToolbars />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={(content) => onSetContent(content)}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={editorStyle}
      />
      {errors && errors?.content && (
        <p className="text-field-error italic text-red-500">
          {errors?.content?.message}
        </p>
      )}
    </>
  );
};

export default Editor;
