const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Language mappings for Judge0
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
};

// Compile and run code
router.post('/', requireAuth, [
  body('code').trim().notEmpty(),
  body('language').isIn(['javascript', 'python', 'java', 'cpp']),
  body('input').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, language, input } = req.body;
    const languageId = LANGUAGE_IDS[language];

    if (!languageId) {
      return res.status(400).json({ message: 'Unsupported language' });
    }

    // For demo purposes, we'll simulate the Judge0 API response
    // In production, you would make actual API calls to Judge0
    const simulateExecution = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate different outcomes based on code content
          if (code.includes('print') || code.includes('console.log') || code.includes('cout')) {
            resolve({
              stdout: 'Hello, World!\n',
              stderr: null,
              compile_output: null,
              message: null,
              status: { id: 3, description: 'Accepted' },
              time: '0.012',
              memory: 2048,
            });
          } else if (code.includes('error') || code.includes('Error')) {
            resolve({
              stdout: null,
              stderr: 'Error: Something went wrong\n',
              compile_output: null,
              message: null,
              status: { id: 6, description: 'Compilation Error' },
              time: '0.000',
              memory: 0,
            });
          } else {
            resolve({
              stdout: 'Code executed successfully\n',
              stderr: null,
              compile_output: null,
              message: null,
              status: { id: 3, description: 'Accepted' },
              time: '0.008',
              memory: 1024,
            });
          }
        }, 1000);
      });
    };

    const result = await simulateExecution();

    res.json({
      success: true,
      output: result.stdout || result.stderr || 'No output',
      error: result.stderr,
      status: result.status.description,
      time: result.time,
      memory: result.memory,
    });

  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Compilation service unavailable',
      error: error.message 
    });
  }
});

// Test code against test cases
router.post('/test', requireAuth, [
  body('code').trim().notEmpty(),
  body('language').isIn(['javascript', 'python', 'java', 'cpp']),
  body('testCases').isArray({ min: 1 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, language, testCases } = req.body;
    const results = [];

    // Simulate running each test case
    for (const testCase of testCases) {
      const { input, expectedOutput } = testCase;
      
      // Simulate test execution
      const simulateTest = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            // Simple simulation - in production, you'd run actual tests
            const passed = Math.random() > 0.3; // 70% pass rate for demo
            const actualOutput = passed ? expectedOutput : 'Wrong output';
            
            resolve({
              input,
              expectedOutput,
              actualOutput,
              passed,
              status: passed ? 'Accepted' : 'Wrong Answer',
              time: '0.012',
              memory: 2048,
            });
          }, 500);
        });
      };

      const result = await simulateTest();
      results.push(result);
    }

    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;

    res.json({
      success: true,
      results,
      summary: {
        passed: passedTests,
        total: totalTests,
        percentage: Math.round((passedTests / totalTests) * 100),
      },
    });

  } catch (error) {
    console.error('Test execution error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Test execution failed',
      error: error.message 
    });
  }
});

module.exports = router;