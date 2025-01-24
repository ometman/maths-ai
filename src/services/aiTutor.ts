import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export type Solution = {
  steps: {
    title: string;
    explanation: string;
    formula?: string;
  }[];
  finalAnswer: string;
  relatedConcepts: string[];
};

const MATH_SYSTEM_PROMPT = `You are an expert math tutor specializing in K-12 mathematics. 
Your responses should:
1. Break down problems into clear, logical steps
2. Explain concepts using simple language
3. Include relevant formulas when necessary
4. Provide the final answer
5. Suggest related concepts for further learning

Format your response as JSON with the following structure:
{
  "steps": [
    {
      "title": "Step title",
      "explanation": "Detailed explanation",
      "formula": "Optional mathematical formula"
    }
  ],
  "finalAnswer": "The final answer",
  "relatedConcepts": ["Related topic 1", "Related topic 2"]
}`;

export async function getAITutorResponse(
  question: string,
  topic: string
): Promise<Solution> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: MATH_SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Topic: ${topic}\nQuestion: ${question}\n\nProvide a step-by-step solution.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");
    return response as Solution;
  } catch (error) {
    console.error('AI Tutor Error:', error);
    throw new Error('Failed to get AI tutor response');
  }
}

