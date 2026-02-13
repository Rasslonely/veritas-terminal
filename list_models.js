const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const list = await genAI.getGenerativeModel({ model: "gemini-pro" }).listModels();
    console.log("AVAILABLE MODELS:");
    for (const model of list.models) {
      console.log(`- ${model.name}`);
    }
  } catch (e) {
    console.error("Failed to list models:", e);
  }
}

listModels();
