const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { message } = JSON.parse(event.body || '{}');

  if (!message || typeof message !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({ reply: "Invalid message input." })
    };
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are KSMD AI assistant. Respond clearly and helpfully." },
        { role: "user", content: message }
      ]
    });

    const choices = response?.data?.choices;
    const reply = choices?.[0]?.message?.content || "⚠️ AI response unavailable.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error("❌ OpenAI error:", error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "🔥 AI error occurred. Check API key or quota." })
    };
  }
};
