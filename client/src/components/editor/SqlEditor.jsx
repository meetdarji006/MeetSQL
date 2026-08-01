import React from "react";
import Editor from "@monaco-editor/react";

export function SqlEditor({ value, onChange, onRun, onSubmit, isPending }) {
  const handleEditorMount = (editor, monaco) => {
    // Remeasured fonts when web fonts complete loading to prevent cursor misalignment
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        monaco.editor.remeasureFonts();
      });
    }

    // Define custom dark theme matching MeetSQL palette
    monaco.editor.defineTheme("meetsql-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "a78bfa", fontStyle: "bold" },
        { token: "string", foreground: "34d399" },
        { token: "number", foreground: "f59e0b" },
        { token: "comment", foreground: "64748b", fontStyle: "italic" },
        { token: "operator", foreground: "cbd5e1" },
      ],
      colors: {
        "editor.background": "#1a2233",
        "editor.foreground": "#cbd5e1",
        "editorCursor.foreground": "#7c3aed",
        "editor.lineHighlightBackground": "#252d3d50",
        "editorLineNumber.foreground": "#64748b",
        "editorLineNumber.activeForeground": "#a78bfa",
        "editor.selectionBackground": "#7c3aed40",
      },
    });

    monaco.editor.setTheme("meetsql-dark");

    // Add Ctrl+Enter or Cmd+Enter shortcut for Run Query
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun && !isPending) onRun();
    });

    // Add Ctrl+Shift+Enter for Submit
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        if (onSubmit && !isPending) onSubmit();
      }
    );
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-[#252d3d] bg-[#1a2233]">
      <Editor
        height="100%"
        defaultLanguage="sql"
        theme="meetsql-dark"
        value={value}
        onChange={onChange}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          fontFamily: "Consolas, 'Courier New', 'JetBrains Mono', monospace",
          fontLigatures: false,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          lineNumbersMinChars: 3,
          suggestOnTriggerCharacters: true,
          wordWrap: "on",
          tabSize: 2,
        }}
      />
    </div>
  );
}
