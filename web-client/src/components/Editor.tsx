import * as monaco from 'monaco-editor';
import { useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs'
import { MonacoBinding } from 'y-monaco'
import { WebsocketProvider } from 'y-websocket'



const MonacoEditor = () => {

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {


    if (!editorRef.current) return;

    const ydoc = new Y.Doc()
    const type = ydoc.getText('monaco')
    const provider = new WebsocketProvider(
      `${location.protocol === 'http:' ? 'ws:' : 'wss:'}//localhost:1234`,
      'monaco',
      ydoc
    );
    if (editorRef.current) {
      const monacoBinding = new MonacoBinding(
        type,
        editorRef.current.getModel()!,
        new Set([editorRef.current]),
        provider.awareness
      );
      return () => {
        monacoBinding.destroy();
        provider.destroy();
        ydoc.destroy();
      }
    }
  }, [editorRef.current]);

  const handleEditorMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  }, []);


  return (
    <Editor
      height="100vh"
      width="100%"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      theme="vs-dark"
      onMount={handleEditorMount}
    />
  )
}

export default MonacoEditor;

