import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { initialMessage } from "./context.js";

dotenv.config();

const generateId = () => Math.random().toString(36).slice(2, 15);

const buildGoogleGenAIPrompt = (messages) => [
    { id: generateId(), role: initialMessage.role, content: initialMessage.content },
    ...messages.map((message) => ({
        id: message.id || generateId(),
        role: message.role,
        content: message.content,
    })),
];

const getResponse = async (req, res) => {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }
        const { messages } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const conversation = buildGoogleGenAIPrompt(messages);

        const result = await model.generateContent({
            contents: conversation.map(({ role, content }) => ({
                role,
                parts: [{ text: content }],
            })),
        });

        const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        res.json({ response: responseText });

    } catch (error) {
        console.error("Error in chatbot API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default getResponse;
