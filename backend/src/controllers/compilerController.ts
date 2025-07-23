import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { compileJava, CompileRequest } from '../services/javaCompilerService';

export const compileCode = async (req: AuthRequest, res: Response) => {
  try {
    const { code, input } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    const compileRequest: CompileRequest = {
      code: code.trim(),
      input: input || ''
    };

    const result = await compileJava(compileRequest);

    res.json({
      success: result.status === 'success',
      output: result.output,
      error: result.error,
      compilationTime: result.compilationTime,
      executionTime: result.executionTime,
      memoryUsed: result.memoryUsed,
      status: result.status
    });
  } catch (error) {
    console.error('Compile code error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to compile code',
      error: 'Internal server error'
    });
  }
};