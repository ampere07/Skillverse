import axios from 'axios';

export interface CompileRequest {
  code: string;
  input: string;
}

export interface CompileResponse {
  output: string;
  error: string;
  compilationTime: number;
  executionTime: number;
  memoryUsed: number;
  status: 'success' | 'compilation_error' | 'runtime_error' | 'timeout';
}

export const compileJava = async (request: CompileRequest): Promise<CompileResponse> => {
  try {
    const judge0Config = {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    };

    // Submit code to Judge0
    const submissionData = {
      source_code: request.code,
      language_id: 62, // Java (OpenJDK 13.0.1)
      stdin: request.input || '',
      cpu_time_limit: 2,
      memory_limit: 128000,
      wall_time_limit: 5
    };

    const submitResponse = await axios.post(
      `${process.env.JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      submissionData,
      judge0Config
    );

    const result = submitResponse.data;

    // Process the result
    let status: 'success' | 'compilation_error' | 'runtime_error' | 'timeout';
    let output = '';
    let error = '';

    if (result.status.id === 3) { // Accepted
      status = 'success';
      output = result.stdout || '';
    } else if (result.status.id === 6) { // Compilation Error
      status = 'compilation_error';
      error = result.compile_output || 'Compilation failed';
    } else if (result.status.id === 5) { // Time Limit Exceeded
      status = 'timeout';
      error = 'Time limit exceeded';
    } else {
      status = 'runtime_error';
      error = result.stderr || result.compile_output || 'Runtime error occurred';
    }

    return {
      output,
      error,
      compilationTime: parseFloat(result.time) || 0,
      executionTime: parseFloat(result.time) || 0,
      memoryUsed: parseInt(result.memory) || 0,
      status
    };

  } catch (error) {
    console.error('Java compilation error:', error);
    return {
      output: '',
      error: 'Failed to compile code. Please try again.',
      compilationTime: 0,
      executionTime: 0,
      memoryUsed: 0,
      status: 'compilation_error'
    };
  }
};