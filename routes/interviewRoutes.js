import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

// GROQ INIT
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/interview-questions", async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const prompt = `
      Generate exactly 5 interview questions for the role: ${role}.
      Return ONLY a JSON array like:
      ["Q1", "Q2", "Q3", "Q4", "Q5"]
    `;

    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = result.choices[0].message.content;

// remove markdown if present
const cleanText = text.replace(/```json|```/g, "").trim();

    let questions;
    try {
      questions = JSON.parse(text);
    } catch {
      questions = text.split("\n").filter((q) => q.trim());
    }

    res.json({ questions });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ message: "Groq API error", details: error.message });
  }
});


router.post("/final-feedback", async (req, res) => {
  try {
    const { qaList } = req.body;

    if (!qaList || qaList.length === 0) {
      return res.status(400).json({ message: "No answers provided" });
    }

    const formattedQA = qaList
      .map((item, i) => `Q${i + 1}: ${item.question}\nA: ${item.answer}`)
      .join("\n\n");

    const prompt = `
You are an experienced technical interviewer.

Evaluate the candidate based on the following interview:

${formattedQA}

Give output in this format:

Score: (out of 10)
Strengths:
- ...
- ...

Weaknesses:
- ...
- ...

Suggestions:
- ...
- ...
`;

    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const feedback = result.choices[0].message.content;

    res.json({ feedback });

  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({ message: "Error generating feedback" });
  }
});

export default router;
