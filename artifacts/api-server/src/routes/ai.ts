import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body as {
      messages: { role: "user" | "assistant"; content: string }[];
      systemPrompt?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [];

    if (systemPrompt) {
      chatMessages.push({ role: "system", content: systemPrompt });
    } else {
      chatMessages.push({
        role: "system",
        content:
          "You are Alabi, an expert agricultural AI assistant for GreenedIn, a platform for African farmers. Provide practical farming advice. Never use emojis.",
      });
    }

    chatMessages.push(...messages);

    const stream = await openai.chat.completions.create({
      model: "gpt-5.1",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    req.log.error({ err }, "AI chat error");
    if (!res.headersSent) {
      res.status(500).json({ error: "AI service unavailable" });
    } else {
      res.write(`data: ${JSON.stringify({ content: "\n\nSorry, I encountered an error. Please try again." })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    }
  }
});

export default router;
