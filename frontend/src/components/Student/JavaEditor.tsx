import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import Button from '../Common/Button';
import OutputConsole from '../Common/OutputConsole';
import { compileJavaCode } from '../../services/javaCompiler';
import { CompileResult } from '../../types';

interface JavaEditorProps {
  initialCode: string;
  onCodeChange: (code: string) => void;
  onSave?: (code: string) => void;
  readOnly?: boolean;
  showSaveButton?: boolean;
}

const JavaEditor: React.FC<JavaEditorProps> = ({
  initialCode,
  onCodeChange,
  onSave,
  readOnly = false,
  showSaveButton = true
}) => {
  const [code, setCode] = useState(initialCode);
  const [input, setInput] = useState('');
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    
    // Configure Java-specific settings
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 4,
      insertSpaces: true,
      autoIndent: 'advanced'
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      onCodeChange(value);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;

    setIsCompiling(true);
    setCompileResult(null);

    try {
      const result = await compileJavaCode(code, input);
      setCompileResult(result);
    } catch (error) {
      setCompileResult({
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        compilationTime: 0,
        executionTime: 0,
        memoryUsed: 0,
        status: 'compilation_error'
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(code);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    onCodeChange(initialCode);
    setCompileResult(null);
    setInput('');
  };

  const handleClearOutput = () => {
    setCompileResult(null);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const containerClass = isFullScreen
    ? 'fixed inset-0 z-50 bg-white'
    : 'h-full';

  return (
    <div className={`${containerClass} flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Java Editor</h3>
          {!readOnly && (
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                size="sm"
                icon={Play}
                onClick={handleRunCode}
                disabled={isCompiling}
                loading={isCompiling}
              >
                Run Code
              </Button>
              {showSaveButton && (
                <Button
                  variant="success"
                  size="sm"
                  icon={Save}
                  onClick={handleSave}
                  disabled={isSaving}
                  loading={isSaving}
                >
                  Save
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                icon={RotateCcw}
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            icon={isFullScreen ? Minimize2 : Maximize2}
            onClick={toggleFullScreen}
          >
            {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 border-r border-gray-200">
            <Editor
              height="100%"
              language="java"
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorMount}
              options={{
                readOnly,
                theme: 'vs-dark',
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                autoIndent: 'advanced'
              }}
            />
          </div>
          
          {!readOnly && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input (optional)
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Enter input for your program..."
              />
            </div>
          )}
        </div>

        <div className="w-96 flex flex-col">
          <OutputConsole
            output={compileResult?.output || ''}
            error={compileResult?.error || ''}
            isCompiling={isCompiling}
            compilationTime={compileResult?.compilationTime}
            executionTime={compileResult?.executionTime}
            memoryUsed={compileResult?.memoryUsed}
            onClear={handleClearOutput}
          />
        </div>
      </div>
    </div>
  );
};

export default JavaEditor;