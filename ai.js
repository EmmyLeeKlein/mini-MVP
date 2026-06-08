// ai.js — Frontend module that calls the Netlify serverless function

const DEMO_QUESTIONS = [
  {
    question: "Tell me about yourself and why you're interested in this role.",
    intent: "The interviewer wants to understand your background, motivation, and whether you're a good fit for the role and company culture.",
    structure: "Start with a brief personal background, mention relevant skills or studies, explain what draws you to this specific role, and end with why you're excited about the opportunity.",
    example: "I'm a computer science student in my third year, with a strong interest in frontend development. I've worked on several personal projects using React and enjoyed building user interfaces. I'm drawn to this role because I want to apply my skills in a real product environment and learn from an experienced team."
  },
  {
    question: "Describe a challenge you faced and how you overcame it.",
    intent: "The interviewer is testing your problem-solving skills, resilience, and ability to reflect on your experience.",
    structure: "Use the STAR method: Situation, Task, Action, Result. Keep it concise and focus on what you personally did.",
    example: "During a group project, our team disagreed on the technical approach. I organized a short meeting, presented a comparison of both options with pros and cons, and we reached a consensus. The project was delivered on time and we all learned to communicate better under pressure."
  },
  {
    question: "Where do you see yourself in 3 years?",
    intent: "The interviewer wants to assess your ambition, career planning, and whether your goals align with what the company can offer.",
    structure: "Show growth mindset, mention skills you want to develop, and connect your goals to the role and industry.",
    example: "In three years, I hope to have grown into a mid-level developer who can lead small features independently. I want to deepen my knowledge in system design and contribute to meaningful products. This role feels like the right first step toward that path."
  },
  {
    question: "What are your greatest strengths?",
    intent: "The interviewer wants to understand what you bring to the table and whether your strengths are relevant to the job.",
    structure: "Pick 2–3 strengths, give a specific example for each, and tie them back to how they'll help you in this role.",
    example: "I'm highly detail-oriented — I always double-check my code before submitting. I'm also a fast learner; when I picked up TypeScript for a project, I was productive within a week. And I communicate well in teams, which helps resolve misunderstandings early."
  },
  {
    question: "Why should we hire you?",
    intent: "The interviewer is giving you a chance to make a final case for yourself. They want confidence, clarity, and relevance.",
    structure: "Summarize your top 2–3 relevant strengths, mention your enthusiasm for the role, and briefly explain the value you'd bring to the team.",
    example: "I'm a motivated candidate who combines technical ability with strong communication skills. I've proven I can learn quickly and deliver results in team settings. I'm genuinely excited about this company's mission, and I'm ready to contribute from day one while continuing to grow."
  }
];

async function generateKit(role, level) {
  try {
    const response = await fetch('/.netlify/functions/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, level })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      // If it's a missing API key error, return demo
      if (response.status === 503) {
        return { questions: DEMO_QUESTIONS, isDemo: true };
      }
      throw new Error(err.message || 'API request failed');
    }

    const data = await response.json();
    return { questions: data.questions, isDemo: false };

  } catch (err) {
    // Network error or function not available — return demo
    console.warn('AI function unavailable, using demo data:', err.message);
    return { questions: DEMO_QUESTIONS, isDemo: true };
  }
}