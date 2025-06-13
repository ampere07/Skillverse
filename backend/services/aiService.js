const axios = require('axios');

const analyzeCode = async (code, language, assignment) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured');
      return null;
    }

    const prompt = `
Analyze this ${language} code for a programming assignment:

Assignment: ${assignment.title}
Description: ${assignment.description}

Code:
${code}

Please provide:
1. Code quality score (0-100)
2. Efficiency score (0-100)
3. Correctness score (0-100)
4. 3-5 specific improvement suggestions

Format your response as JSON with the following structure:
{
  "codeQuality": number,
  "efficiency": number,
  "correctness": number,
  "suggestions": ["suggestion1", "suggestion2", ...]
}
`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a computer science teacher analyzing student code. Provide constructive feedback.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const analysis = JSON.parse(response.data.choices[0].message.content);
    return analysis;
  } catch (error) {
    console.error('AI analysis error:', error);
    return null;
  }
};

const generateRecommendations = async (studentSkills, completedAssignments) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured');
      return [];
    }

    const prompt = `
Based on a student's skill levels and completed assignments, recommend 3-5 topics they should focus on next.

Current skill levels:
${Object.entries(studentSkills).map(([skill, level]) => `${skill}: ${level}/100`).join('\n')}

Recently completed assignments:
${completedAssignments.map(a => `- ${a.title} (${a.difficulty})`).join('\n')}

Provide recommendations as a JSON array of strings:
["topic1", "topic2", "topic3", ...]

Focus on areas where the student can improve and build upon their current knowledge.
`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI tutor providing personalized learning recommendations for computer science students.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.5
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const recommendations = JSON.parse(response.data.choices[0].message.content);
    return recommendations;
  } catch (error) {
    console.error('AI recommendations error:', error);
    return [];
  }
};

module.exports = {
  analyzeCode,
  generateRecommendations
};