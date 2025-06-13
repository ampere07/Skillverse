const axios = require('axios');

// Judge0 language IDs
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50
};

const executeCode = async (code, language, input = '') => {
  try {
    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      throw new Error('Unsupported language');
    }

    // Judge0 API endpoint
    const judge0Url = 'https://judge0-ce.p.rapidapi.com/submissions';
    
    const submissionData = {
      source_code: Buffer.from(code).toString('base64'),
      language_id: languageId,
      stdin: Buffer.from(input).toString('base64')
    };

    // Submit code for execution
    const response = await axios.post(`${judge0Url}?base64_encoded=true&wait=false`, submissionData, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    });

    const token = response.data.token;

    // Wait and get result
    let result;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const resultResponse = await axios.get(`${judge0Url}/${token}?base64_encoded=true`, {
        headers: {
          'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });

      result = resultResponse.data;
      attempts++;
    } while (result.status.id <= 2 && attempts < maxAttempts);

    // Decode base64 output
    const output = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '';
    const error = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '';

    return {
      success: result.status.id === 3, // Accepted
      output: output,
      error: error,
      status: result.status.description,
      time: result.time,
      memory: result.memory
    };
  } catch (error) {
    console.error('Code execution error:', error);
    return {
      success: false,
      output: '',
      error: error.message,
      status: 'Error',
      time: null,
      memory: null
    };
  }
};

const runTestCases = async (code, language, testCases) => {
  const results = [];
  
  for (const testCase of testCases) {
    const result = await executeCode(code, language, testCase.input);
    
    results.push({
      testCase: {
        input: testCase.input,
        expectedOutput: testCase.expectedOutput
      },
      actualOutput: result.output.trim(),
      passed: result.success && result.output.trim() === testCase.expectedOutput.trim(),
      executionTime: result.time,
      error: result.error
    });
  }

  return results;
};

module.exports = {
  executeCode,
  runTestCases
};