import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import db from "./src/db";
import { GoogleGenAI } from "@google/genai";

type TaskUpdateBody = {
  title?: string;
  points?: number;
  assignedTo?: string;
  category?: string;
  completed?: boolean;
  recurrence?: "daily" | "weekly" | "none";
};

const parseJsonResponse = (text: string) => {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
};

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const buildFallbackSuggestions = (age: number, interestsText: string) => {
  const interests = interestsText.split(/,|and/).map(part => part.trim()).filter(Boolean);
  const primaryInterest = interests[0] || 'their interests';

  return [
    {
      title: `Organize ${primaryInterest.toLowerCase()}`,
      points: Math.max(10, Math.min(40, age * 4)),
      reason: `A simple task that matches ${primaryInterest.toLowerCase()} and builds responsibility.`
    },
    {
      title: 'Tidy up the play area',
      points: Math.max(8, Math.min(30, age * 3)),
      reason: 'A quick win to keep the space neat and easy to use.'
    },
    {
      title: `Spend 15 minutes on ${primaryInterest.toLowerCase()}`,
      points: Math.max(12, Math.min(35, age * 4)),
      reason: `Turns ${primaryInterest.toLowerCase()} into a positive routine.`
    },
    {
      title: 'Help with one family chore',
      points: Math.max(15, Math.min(45, age * 5)),
      reason: 'Builds teamwork while keeping the task age-appropriate.'
    },
    {
      title: 'Read or learn something new',
      points: Math.max(10, Math.min(32, age * 3)),
      reason: 'Encourages learning and focus in a simple way.'
    }
  ];
};

async function startServer() {
  const app = express();
  // const PORT = 3000;
  // const PORT = process.env.PORT || 8080;
  const PORT = parseInt(process.env.PORT || "8080", 10);

  app.use(express.json());

  // API Routes
  app.get("/api/kids", (req, res) => {
    const kids = db.prepare("SELECT * FROM kids").all();
    res.json(kids);
  });

  const getTasksHandler = (req: express.Request, res: express.Response) => {
    const tasks = db.prepare("SELECT * FROM tasks ORDER BY createdAt DESC").all();
    res.json(tasks);
  };

  const createTaskHandler = (req: express.Request, res: express.Response) => {
    const { title, points, assignedTo, category, recurrence } = req.body;

    if (!title || points == null || !assignedTo || !category) {
      return res.status(400).json({ error: "title, points, assignedTo and category are required" });
    }

    const numericPoints = Number(points);
    if (!Number.isFinite(numericPoints) || numericPoints < 0) {
      return res.status(400).json({ error: "points must be a non-negative number" });
    }

    const info = db.prepare(
      "INSERT INTO tasks (title, points, assignedTo, category, recurrence) VALUES (?, ?, ?, ?, ?)"
    ).run(title, numericPoints, assignedTo, category, recurrence ?? "none");
    res.status(201).json({ id: Number(info.lastInsertRowid) });
  };

  const updateTaskHandler = (req: express.Request, res: express.Response) => {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId)) {
      return res.status(400).json({ error: "Invalid task id" });
    }

    const existingTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { title, points, assignedTo, category, completed, recurrence } = req.body as TaskUpdateBody;
    const fields: string[] = [];
    const values: Array<string | number> = [];

    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }

    if (points !== undefined) {
      const numericPoints = Number(points);
      if (!Number.isFinite(numericPoints) || numericPoints < 0) {
        return res.status(400).json({ error: "points must be a non-negative number" });
      }
      fields.push("points = ?");
      values.push(numericPoints);
    }

    if (assignedTo !== undefined) {
      fields.push("assignedTo = ?");
      values.push(assignedTo);
    }

    if (category !== undefined) {
      fields.push("category = ?");
      values.push(category);
    }

    if (completed !== undefined) {
      fields.push("completed = ?");
      values.push(completed ? 1 : 0);
    }

    if (recurrence !== undefined) {
      if (!["daily", "weekly", "none"].includes(recurrence)) {
        return res.status(400).json({ error: "recurrence must be daily, weekly, or none" });
      }
      fields.push("recurrence = ?");
      values.push(recurrence);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No updatable fields provided" });
    }

    values.push(taskId);
    db.prepare(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    const updatedTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
    res.json(updatedTask);
  };

  const suggestTasksHandler = async (req: express.Request, res: express.Response) => {
    const { childAge, interests } = req.body as { childAge?: number; interests?: string | string[] };
    const ai = getGeminiClient();

    if (childAge == null || !interests) {
      return res.status(400).json({ error: "childAge and interests are required" });
    }

    const age = Number(childAge);
    if (!Number.isFinite(age) || age < 2 || age > 18) {
      return res.status(400).json({ error: "childAge must be a number between 2 and 18" });
    }

    const interestsText = Array.isArray(interests) ? interests.join(", ") : interests;

    if (!ai) {
      return res.json(buildFallbackSuggestions(age, interestsText));
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Generate exactly 5 age-appropriate chores for a child aged ${age} with interests in ${interestsText}. Return only valid JSON as an array. Each item must have: title (string), points (integer from 5 to 100), and reason (short string).`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
        },
      });

      const suggestions = parseJsonResponse(response.text ?? "[]");
      if (!Array.isArray(suggestions)) {
        return res.status(502).json({ error: "Unexpected AI response format" });
      }

      res.json(suggestions.slice(0, 5));
    } catch (error) {
      console.error("AI Error (suggest tasks):", error);
      res.json(buildFallbackSuggestions(age, interestsText));
    }
  };

  const motivateHandler = async (req: express.Request, res: express.Response) => {
    const { kidName, taskName } = req.body as { kidName?: string; taskName?: string };
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    }

    if (!kidName || !taskName) {
      return res.status(400).json({ error: "kidName and taskName are required" });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Write exactly one celebratory sentence in a friendly mix of English and Roman Urdu for a child named ${kidName} who completed this task: ${taskName}. Keep it under 20 words and positive.`,
              },
            ],
          },
        ],
      });

      const message = (response.text ?? "").replace(/\s+/g, " ").trim();
      res.json({ message });
    } catch (error) {
      console.error("AI Error (motivate):", error);
      res.status(500).json({ error: "Failed to generate motivation message" });
    }
  };

  // Required task CRUD routes
  app.get("/tasks", getTasksHandler);
  app.post("/tasks", createTaskHandler);
  app.patch("/tasks/:id", updateTaskHandler);

  // Existing frontend compatibility routes
  app.get("/api/tasks", getTasksHandler);
  app.post("/api/tasks", createTaskHandler);

  app.post("/api/tasks/:id/complete", (req, res) => {
    const { id } = req.params;
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as any;
    
    if (task && !task.completed) {
      db.prepare("UPDATE tasks SET completed = 1 WHERE id = ?").run(id);
      db.prepare("UPDATE kids SET points = points + ? WHERE id = ?").run(task.points, task.assignedTo);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Task already completed or not found" });
    }
  });

  // Requested AI routes
  app.post("/api/ai/suggest-tasks", suggestTasksHandler);
  app.post("/api/ai/motivate", motivateHandler);

  // Legacy alias used by current frontend
  app.post("/api/ai/suggest", async (req, res) => {
    req.body = {
      childAge: req.body?.age,
      interests: req.body?.interests,
    };
    await suggestTasksHandler(req, res);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
