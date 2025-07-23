import api from './api';
import { CompileResult } from '../types';

export const compileJavaCode = async (code: string, input: string = ''): Promise<CompileResult> => {
  try {
    const response = await api.post('/api/compiler/java', { code, input });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Compilation failed');
  }
};

export const runTestCases = async (code: string, testCases: { input: string; expectedOutput: string }[]) => {
  const results = [];
  
  for (const testCase of testCases) {
    try {
      const result = await compileJavaCode(code, testCase.input);
      const passed = result.success && result.output.trim() === testCase.expectedOutput.trim();
      
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.output,
        passed,
        error: result.error,
        compilationTime: result.compilationTime,
        executionTime: result.executionTime
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: '',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        compilationTime: 0,
        executionTime: 0
      });
    }
  }
  
  return results;
};