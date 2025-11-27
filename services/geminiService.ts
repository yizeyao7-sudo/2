import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWalkingDirections = async (destination: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `我是一名视障用户，正步行前往：${destination}。请提供3-5条清晰、简单的步行导航指令，模拟从我当前位置出发（假设一个通用的城市环境）。请用中文回答。`,
      config: {
        systemInstruction: "你是一个帮助盲人的导航助手。严格输出JSON格式。使用简短的中文句子。专注于安全提示。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  instruction: { type: Type.STRING, description: "指令文本，例如：'向前直行50米'" },
                  distance: { type: Type.STRING, description: "距离，例如：'50米'" },
                  direction: { type: Type.STRING, enum: ["left", "right", "straight", "arrive"] }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{"steps": []}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
        steps: [
            { instruction: "向前直行前往目的地。", distance: "100米", direction: "straight" },
            { instruction: "导航数据暂时不可用。", distance: "0米", direction: "arrive" }
        ]
    };
  }
};

export const getVisualDescription = async (context: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `根据这个上下文为盲人用户描述周围环境：${context}。请用中文回答，保持在20个字以内。`,
    });
    return response.text || "暂无描述。";
  } catch (error) {
    return "服务不可用。";
  }
}