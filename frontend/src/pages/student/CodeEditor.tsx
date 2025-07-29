import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  AlertTitle,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Tooltip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow,
  Save,
  Refresh,
  Fullscreen,
  FullscreenExit,
  Settings,
  Code,
  Terminal,
  FileOpen,
  CloudUpload,
  Download,
  Share,
  History,
  BugReport,
  Speed,
  Memory,
  Timer,
  CheckCircle,
  Error,
  Warning,
  Info,
  Clear,
  MoreVert,
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import { compileJavaCode } from '../../services/javaCompiler';
import { CompileResult } from '../../types';

interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  category: string;
}

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, SkillVerse!");
        
        // Your code here
        
    }
}`);
  const [input, setInput] = useState('');
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('vs-dark');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [executionHistory, setExecutionHistory] = useState<CompileResult[]>([]);
  const editorRef = useRef<any>(null);

  const codeTemplates: CodeTemplate[] = [
    {
      id: '1',
      name: 'Hello World',
      description: 'Basic Java program structure',
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      category: 'Basics',
    },
    {
      id: '2',
      name: 'Input/Output',
      description: 'Reading user input with Scanner',
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        
        System.out.println("Hello, " + name + "!");
        
        scanner.close();
    }
}`,
      category: 'Basics',
    },
    {
      id: '3',
      name: 'Array Operations',
      description: 'Working with arrays',
      code: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        
        // Print array elements
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Element " + i + ": " + numbers[i]);
        }
        
        // Enhanced for loop
        for (int num : numbers) {
            System.out.print(num + " ");
        }
    }
}`,
      category: 'Data Structures',
    },
  ];

  useEffect(() => {
    // Load saved code from localStorage if available
    const savedCode = localStorage.getItem('skillverse-editor-code');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    
    // Configure editor
    editor.updateOptions({
      fontSize,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      autoIndent: 'advanced',
      lineNumbers: 'on',
      renderLineHighlight: 'all',
      selectOnLineNumbers: true,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      // Auto-save to localStorage
      localStorage.setItem('skillverse-editor-code', value);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;

    setIsCompiling(true);
    setActiveTab(1); // Switch to output tab

    try {
      const result = await compileJavaCode(code, input);
      setCompileResult(result);
      
      // Add to execution history
      setExecutionHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 executions
    } catch (error) {
      const errorResult: CompileResult = {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        compilationTime: 0,
        executionTime: 0,
        memoryUsed: 0,
        status: 'compilation_error'
      };
      setCompileResult(errorResult);
      setExecutionHistory(prev => [errorResult, ...prev.slice(0, 9)]);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('skillverse-editor-code', code);
    // Show success message
  };

  const handleReset = () => {
    setCode(codeTemplates[0].code);
    setCompileResult(null);
    setInput('');
  };

  const handleTemplateSelect = (template: CodeTemplate) => {
    setCode(template.code);
    setTemplatesOpen(false);
  };

  const handleClearOutput = () => {
    setCompileResult(null);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'compilation_error':
        return <Error sx={{ color: 'error.main' }} />;
      case 'runtime_error':
        return <Warning sx={{ color: 'warning.main' }} />;
      case 'timeout':
        return <Timer sx={{ color: 'error.main' }} />;
      default:
        return <Info sx={{ color: 'info.main' }} />;
    }
  };

  const containerClass = isFullScreen
    ? 'fixed inset-0 z-50 bg-white'
    : 'h-full';

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              💻 Code Editor
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              Write, test, and debug your Java code
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handleRunCode}
              disabled={isCompiling}
              sx={{ borderRadius: 3 }}
            >
              {isCompiling ? 'Running...' : 'Run Code'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Save />}
              onClick={handleSave}
              sx={{ borderRadius: 3 }}
            >
              Save
            </Button>
            <IconButton
              onClick={(e) => setMenuAnchorEl(e.currentTarget)}
              sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
            >
              <MoreVert />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Quick Actions */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<FileOpen />}
          onClick={() => setTemplatesOpen(true)}
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Templates
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReset}
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Reset
        </Button>
        <Button
          variant="outlined"
          startIcon={<Settings />}
          onClick={() => setSettingsOpen(true)}
          size="small"
          sx={{ borderRadius: 2 }}
        >
          Settings
        </Button>
        <Button
          variant="outlined"
          startIcon={isFullScreen ? <FullscreenExit /> : <Fullscreen />}
          onClick={toggleFullScreen}
          size="small"
          sx={{ borderRadius: 2 }}
        >
          {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </Stack>

      {/* Editor Layout */}
      <Box className={containerClass}>
        <Grid container spacing={3} sx={{ height: isFullScreen ? '100vh' : '70vh' }}>
          {/* Code Editor */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'grey.50',
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    📝 Main.java
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<Code />}
                      label="Java"
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={`${code.split('\n').length} lines`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </Box>
              <Box sx={{ flex: 1, bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#ffffff' }}>
                <Editor
                  height="100%"
                  language="java"
                  value={code}
                  onChange={handleCodeChange}
                  onMount={handleEditorMount}
                  theme={theme}
                  options={{
                    fontSize,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    tabSize: 4,
                    insertSpaces: true,
                    autoIndent: 'advanced',
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    selectOnLineNumbers: true,
                  }}
                />
              </Box>
            </Card>
          </Grid>

          {/* Side Panel */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  variant="fullWidth"
                >
                  <Tab icon={<Terminal />} label="Input" />
                  <Tab icon={<PlayArrow />} label="Output" />
                  <Tab icon={<History />} label="History" />
                </Tabs>
              </Box>

              <Box sx={{ flex: 1, p: 2 }}>
                {/* Input Tab */}
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      📥 Program Input
                    </Typography>
                    <TextField
                      multiline
                      rows={8}
                      fullWidth
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter input for your program here..."
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                      Tip: Enter each input on a new line if your program reads multiple values
                    </Typography>
                  </Box>
                )}

                {/* Output Tab */}
                {activeTab === 1 && (
                  <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        📤 Program Output
                      </Typography>
                      {compileResult && (
                        <IconButton size="small" onClick={handleClearOutput}>
                          <Clear />
                        </IconButton>
                      )}
                    </Stack>

                    {isCompiling && (
                      <Box sx={{ mb: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            <Code sx={{ fontSize: 16 }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Compiling and running your code...
                            </Typography>
                            <LinearProgress sx={{ mt: 1, borderRadius: 1 }} />
                          </Box>
                        </Stack>
                      </Box>
                    )}

                    {compileResult && (
                      <Box>
                        {/* Status Header */}
                        <Paper
                          sx={{
                            p: 2,
                            mb: 2,
                            bgcolor: compileResult.success ? 'success.50' : 'error.50',
                            border: '1px solid',
                            borderColor: compileResult.success ? 'success.200' : 'error.200',
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {getStatusIcon(compileResult.status)}
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {compileResult.success ? 'Execution Successful' : 'Execution Failed'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Status: {compileResult.status.replace('_', ' ')}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>

                        {/* Performance Metrics */}
                        {compileResult.success && (
                          <Grid container spacing={1} sx={{ mb: 2 }}>
                            <Grid item xs={4}>
                              <Paper sx={{ p: 1, textAlign: 'center' }}>
                                <Timer sx={{ fontSize: 16, color: 'primary.main', mb: 0.5 }} />
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                                  {compileResult.executionTime}ms
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Time
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={4}>
                              <Paper sx={{ p: 1, textAlign: 'center' }}>
                                <Memory sx={{ fontSize: 16, color: 'success.main', mb: 0.5 }} />
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                                  {Math.round(compileResult.memoryUsed / 1024)}KB
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Memory
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={4}>
                              <Paper sx={{ p: 1, textAlign: 'center' }}>
                                <Speed sx={{ fontSize: 16, color: 'warning.main', mb: 0.5 }} />
                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                                  {compileResult.compilationTime}ms
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Compile
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        )}

                        {/* Output/Error Display */}
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: '#1e1e1e',
                            color: 'white',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            minHeight: 200,
                            overflow: 'auto',
                          }}
                        >
                          {compileResult.success ? (
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                              {compileResult.output || 'No output'}
                            </pre>
                          ) : (
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#ff6b6b' }}>
                              {compileResult.error}
                            </pre>
                          )}
                        </Paper>
                      </Box>
                    )}

                    {!compileResult && !isCompiling && (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Terminal sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Run your code to see the output here
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                {/* History Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      🕐 Execution History
                    </Typography>
                    {executionHistory.length > 0 ? (
                      <Stack spacing={2}>
                        {executionHistory.map((result, index) => (
                          <Paper
                            key={index}
                            sx={{
                              p: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 2,
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                              {getStatusIcon(result.status)}
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {result.success ? 'Success' : 'Failed'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                • {result.executionTime}ms
                              </Typography>
                            </Stack>
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: 'monospace',
                                color: 'text.secondary',
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {result.success ? (result.output || 'No output') : result.error}
                            </Typography>
                          </Paper>
                        ))}
                      </Stack>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <History sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Your execution history will appear here
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* More Options Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem onClick={() => setMenuAnchorEl(null)}>
          <ListItemIcon>
            <CloudUpload />
          </ListItemIcon>
          <ListItemText>Upload File</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchorEl(null)}>
          <ListItemIcon>
            <Download />
          </ListItemIcon>
          <ListItemText>Download Code</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchorEl(null)}>
          <ListItemIcon>
            <Share />
          </ListItemIcon>
          <ListItemText>Share Code</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setMenuAnchorEl(null)}>
          <ListItemIcon>
            <BugReport />
          </ListItemIcon>
          <ListItemText>Report Bug</ListItemText>
        </MenuItem>
      </Menu>

      {/* Templates Dialog */}
      <Dialog open={templatesOpen} onClose={() => setTemplatesOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📁 Code Templates
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {codeTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                  }}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {template.description}
                    </Typography>
                    <Chip label={template.category} size="small" color="primary" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplatesOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ⚙️ Editor Settings
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Font Size
              </Typography>
              <Stack direction="row" spacing={1}>
                {[12, 14, 16, 18, 20].map((size) => (
                  <Button
                    key={size}
                    variant={fontSize === size ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setFontSize(size)}
                  >
                    {size}px
                  </Button>
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Theme
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant={theme === 'vs-light' ? 'contained' : 'outlined'}
                  onClick={() => setTheme('vs-light')}
                >
                  Light
                </Button>
                <Button
                  variant={theme === 'vs-dark' ? 'contained' : 'outlined'}
                  onClick={() => setTheme('vs-dark')}
                >
                  Dark
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CodeEditor;
