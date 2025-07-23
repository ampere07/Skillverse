import React from 'react';
import { Copy, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';
import Button from './Button';

interface OutputConsoleProps {
  output: string;
  error: string;
  isCompiling: boolean;
  compilationTime?: number;
  executionTime?: number;
  memoryUsed?: number;
  onClear?: () => void;
}

const OutputConsole: React.FC<OutputConsoleProps> = ({
  output,
  error,
  isCompiling,
  compilationTime,
  executionTime,
  memoryUsed,
  onClear
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const content = error || output;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasContent = output || error;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <h3 className="text-white font-medium">Output Console</h3>
          {isCompiling && (
            <div className="flex items-center space-x-2">
              <div className="loading-spinner border-white"></div>
              <span className="text-white text-sm">Compiling...</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {(compilationTime || executionTime) && (
            <div className="flex items-center space-x-4 text-gray-300 text-sm">
              {compilationTime && (
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{compilationTime.toFixed(2)}s</span>
                </div>
              )}
              {memoryUsed && (
                <div className="flex items-center space-x-1">
                  <Activity size={14} />
                  <span>{memoryUsed} KB</span>
                </div>
              )}
            </div>
          )}
          {hasContent && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </Button>
          )}
          {onClear && hasContent && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClear}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 bg-gray-900 rounded-b-lg overflow-hidden">
        <div className="h-full overflow-y-auto p-4 font-mono text-sm">
          {isCompiling ? (
            <div className="flex items-center space-x-2 text-yellow-400">
              <div className="loading-spinner border-yellow-400"></div>
              <span>Compiling and running your Java code...</span>
            </div>
          ) : error ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-red-400">
                <XCircle size={16} />
                <span className="font-semibold">Compilation Error</span>
              </div>
              <pre className="text-red-300 whitespace-pre-wrap break-words">
                {error}
              </pre>
            </div>
          ) : output ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle size={16} />
                <span className="font-semibold">Output</span>
              </div>
              <pre className="text-green-300 whitespace-pre-wrap break-words">
                {output}
              </pre>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">
              <Activity size={32} className="mx-auto mb-2 opacity-50" />
              <p>Click "Run Code" to see the output</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputConsole;