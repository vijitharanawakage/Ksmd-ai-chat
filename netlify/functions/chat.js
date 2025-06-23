const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { message } = JSON.parse(event.body || '{}');

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are KSMD AI assistant. Be helpful and friendly." },
        { role: "user", content: message }
      ]
    });

    console.log("🧠 FULL OPENAI RESPONSE >>>", JSON.stringify(response.data, null, 2));

    const reply = response?.data?.choices?.[0]?.message?.content?.trim();
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: reply || "⚠️ AI returned no message." })
    };
  } catch (error) {
    console.error("🔥 ERROR from OpenAI:", error?.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "❌ OpenAI API error. Check key or model access." })
    };
  }
};
