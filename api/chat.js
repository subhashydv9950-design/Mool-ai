
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed."
    });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GROQ_API_KEY is not configured."
    });
  }

  try {
    const { topic, language, length } = req.body || {};

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({
        error: "Please enter a topic."
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are AI Rachna Studio, a helpful creative writing assistant. Write original stories, poems, shayari, scripts, and other creative content. Follow the requested language and length."
            },
            {
              role: "user",
              content:
                `Write a creative piece about: ${topic}\n` +
                `Language: ${language || "Hindi"}\n` +
                `Length: ${length || "Medium"}`
            }
          ],
          temperature: 0.8,
          max_tokens: 1200
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Groq request failed."
      });
    }

    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || ""
    });
  } catch (error) {
    return res.status(500).json({
      error: "Could not generate the content. Please try again."
    });
  }
};
    
