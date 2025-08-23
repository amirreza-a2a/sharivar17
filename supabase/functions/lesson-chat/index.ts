import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      console.error("Missing OPENROUTER_API_KEY secret");
      return new Response(JSON.stringify({ error: "Server not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt, selection, lessonTitle } = await req.json();

    const systemPrompt = `You are an embedded systems tutor. Answer concisely with clear steps and, when useful, short code blocks. Use the provided lesson context if present. If the question is about STM32 timers or PWM, reference common registers and pitfalls. If there's selected text, treat it as the primary context.`;

    const userContent = [
      selection ? `Selected context:\n${selection}` : null,
      lessonTitle ? `Lesson: ${lessonTitle}` : null,
      prompt ? `Question: ${prompt}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const body = {
      model: "chutes/fp8",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent || "Help me understand this lesson." },
      ],
      temperature: 0.3,
    };

    console.log("Calling OpenRouter with model chutes/fp8");

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error("OpenRouter error:", resp.status, txt);
      return new Response(JSON.stringify({ error: "Upstream error", status: resp.status }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const generated = data?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate an answer.";

    return new Response(JSON.stringify({ generatedText: generated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("lesson-chat error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
