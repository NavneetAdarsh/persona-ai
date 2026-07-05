import { useState } from 'react';
import { PERSONAS } from './config/personas';
import PersonaToggle from './components/PersonaToggle';
import ChatFeed from './components/ChatFeed';
import ChatInput from './components/ChatInput';

export default function App() {
    const [currentPersona, setCurrentPersona] = useState('hitesh');
    const [isLoading, setIsLoading] = useState(false);

    const [chatHistories, setChatHistories] = useState({
        hitesh: [{ role: 'Mentor', content: "Chai aur code appka swagat hai." }],
        piyush: [{ role: 'Mentor', content: "Self obssesed bana dunga tumhe bhi." }],
    });

    const handleSendMessage = async (text) => {
        const userMessage = { role: 'user', content: text };

        // 1. Immediately update UI with user's message
        setChatHistories(prev => ({
            ...prev,
            [currentPersona]: [...prev[currentPersona], userMessage]
        }));

        setIsLoading(true);

        try {
            // 2. Format history for OpenRouter (Map 'Mentor' to 'assistant' so the LLM understands context)
            const formattedHistory = chatHistories[currentPersona].map(msg => ({
                role: msg.role === 'Mentor' ? 'assistant' : msg.role,
                content: msg.content
            }));

            // 3. Construct payload with System Prompt at the top
            const messagesPayload = [
                { role: "system", content: PERSONAS[currentPersona].systemPrompt },
                ...formattedHistory,
                userMessage
            ];

            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

            // 4. Fire API request to OpenRouter
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "HTTP-Referer": window.location.href,
                    "X-Title": "Persona AI Mentor",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    // Using a high-quality free model from OpenRouter. Change this string to swap models.
                    model: "nvidia/nemotron-3-super-120b-a12b:free", 
                    messages: messagesPayload
                })
            });

            if (!res.ok) {
                throw new Error(`HTTP Error! Status: ${res.status}`);
            }

            const data = await res.json();
            
            // 5. Extract text response
            const llmTextResponse = data.choices?.[0]?.message?.content || "No response generated.";

            const aiResponse = {
                role: 'Mentor',
                content: llmTextResponse
            };

            // 6. Update UI with the live AI response
            setChatHistories(prev => ({
                ...prev,
                [currentPersona]: [...prev[currentPersona], aiResponse]
            }));

        } catch (error) {
            console.error("OpenRouter API error:", error);
            
            // Optional: Provide visual feedback for errors
            setChatHistories(prev => ({
                ...prev,
                [currentPersona]: [...prev[currentPersona], { role: 'Mentor', content: "Sorry, I ran into an error connecting to my server." }]
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4'>
            <div className='w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4'>
                <div className='flex justify-between items-center border-b border-slate-100 pb-4'>
                    <h1 className='text-xl font-bold text-slate-800'>Persona AI Mentor</h1>
                    <PersonaToggle currentPersona={currentPersona} setCurrentPersona={setCurrentPersona} />
                </div>
                <ChatFeed messages={chatHistories[currentPersona]} />

                <ChatInput 
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    currentPersona={currentPersona} 
                />
            </div>
        </div>
    );
}
