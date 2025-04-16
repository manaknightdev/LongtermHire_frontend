import AceEditor from "react-ace";
import Ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-statusbar"; // Import the status bar extension

// config

Ace.config.set(
  "basePath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/"
);
Ace.config.setModuleUrl(
  "ace/mode/javascript_worker",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/worker-javascript.js"
);

interface CodeEditorProps {
  code: string;
  language?: string;
  onChange?: (newValue: string) => void;
  showLineNumbers?: boolean;
  readOnly?: boolean;
  maxHeight?: string;
  fontSize?: string;
}

const CodeEditor = ({
  code,
  language = "javascript",
  onChange,
  showLineNumbers = true,
  readOnly = false,
  maxHeight = "400px",
  fontSize = "",
}: CodeEditorProps) => {
  const editorOptions = {
    showLineNumbers, // Set this to false to hide line numbers
    fixedWidthGutter: false,
    useWorker: false,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    tabSize: 2,
    // Add any other editor options you need
  };
  function onChangeTrigger(newValue: string) {
    if (onChange) {
      onChange(newValue);
    }
  }

  return (
    <div className="h-fit w-full">
      <AceEditor
        mode={language}
        theme={"chaos"}
        fontSize={fontSize}
        name="blah2"
        onChange={onChangeTrigger}
        width="100%"
        height={maxHeight}
        highlightActiveLine={false}
        value={code}
        wrapEnabled
        showPrintMargin={false}
        className="scrollbar-hide"
        style={{ overflowX: "hidden" }}
        readOnly={readOnly}
        tabSize={2}
        editorProps={{ $blockScrolling: true }}
        setOptions={editorOptions}
      />
    </div>
  );
};

export default CodeEditor;
