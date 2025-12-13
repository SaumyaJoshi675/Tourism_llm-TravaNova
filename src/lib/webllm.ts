import { CreateMLCEngine, MLCEngine, InitProgressCallback } from "@mlc-ai/web-llm";

// We'll use a specific model configuration
const SELECTED_MODEL = "Llama-3.2-3B-Instruct-q4f32_1-MLC";

export class LLMService {
    private engine: MLCEngine | null = null;
    private static instance: LLMService;

    private constructor() { }

    public static getInstance(): LLMService {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService();
        }
        return LLMService.instance;
    }

    public isReady(): boolean {
        return !!this.engine;
    }

    public async initialize(onProgress: InitProgressCallback) {
        if (!this.engine) {
            this.engine = await CreateMLCEngine(
                SELECTED_MODEL,
                {
                    initProgressCallback: onProgress,
                    logLevel: "INFO"
                }
            );
        }
        return this.engine;
    }

    public async *chatStream(message: string, context: string) {
        if (!this.engine) {
            throw new Error("Engine not initialized");
        }

        const systemPrompt = `You are TravaNova, a direct and efficient AI Travel Assistant.
    
    INSTRUCTIONS:
    1. **Be Direct**: Answer the question IMMEDIATELY. Do not say "Here is some information" or "I can help with that".
    2. **Structure**: Use bullet points and bold headers (Markdown).
    3. **Brevity**: Keep answers short (max 150 words). No fluff.
    4. **Context**: Use the provided search results to be accurate.
    
    CONTEXT:
    ${context}
    
    Answer as if you are a smart, concise version of ChatGPT.`;

        const messages = [
            { role: "system" as const, content: systemPrompt },
            { role: "user" as const, content: message }
        ];

        const asyncChunkGenerator = await this.engine.chat.completions.create({
            messages,
            temperature: 0.7,
            stream: true, // Enable streaming
        });

        for await (const chunk of asyncChunkGenerator) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                yield content;
            }
        }
    }

    public async chat(message: string, context: string) {
        // Fallback or full non-streaming convenience method
        let fullResponse = "";
        for await (const chunk of this.chatStream(message, context)) {
            fullResponse += chunk;
        }
        return fullResponse;
    }
}
