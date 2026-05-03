import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import db from "./src/db";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/kids", (req, res) => {
    const kids = db.prepare("SELECT * FROM kids").all();
    res.json(kids);
  });

  app.get("/api/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks ORDER BY createdAt DESC").all();
    res.json(tasks);
  });

  app.post("/api/tasks", (req, res) => {
    const { title, points, assignedTo, category, recurrence } = req.body;
    const info = db.prepare(
      "INSERT INTO tasks (title, points, assignedTo, category, recurrence) VALUES (?, ?, ?, ?, ?)"
    ).run(title, points, assignedTo, category, recurrence);
    res.json({ id: info.lastInsertRowid });
  });

  app.post("/api/tasks/:id/complete", (req, res) => {
    const { id } = req.params;
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get() as any;
    
    if (task && !task.completed) {
      db.prepare("UPDATE tasks SET completed = 1 WHERE id = ?").run(id);
      db.prepare("UPDATE kids SET points = points + ? WHERE id = ?").run(task.points, task.assignedTo);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Task already completed or not found" });
    }
  });

  app.post("/api/ai/suggest", async (req, res) => {
    const { age, interests } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest 3 fun and educational tasks for a child aged ${age} who likes ${interests}. 
        Format as JSON array with properties: title, points (10-100), category, description.`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const suggestions = JSON.parse(response.text);
      res.json(suggestions);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
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
