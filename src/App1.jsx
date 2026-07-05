import {useState} from 'react';
import { PERSONAS } from './config/personas';
import PersonaToggle from './components/PersonaToggle';
import ChatFeed from './components/ChatFeed';
import ChatInput from './components/ChatInput';




// export default function App() {
    const [currentPersona,setCurrentPersona] = useState('hitesh');
    const [isLoading,setIsLoading] = useState(false);

    const [chatHistories,setChatHistories] = useState({
        hitesh: [{role:'Mentor',content:"Chai aur code appka swagat hai."}],
        piyush: [{role:'Mentor',content: "Self obssesed bana dunga tumhe bhi."}],
    });

    const handleSendMessage = async(text) => {
        const userMessage = {role:'user',content: text};

        setChatHistories(prev => ({
            ...prev,
            [currentPersona]: [...prev[currentPersona],userMessage]
        }));

        setIsLoading(true);

        try{
            const fullPaylaodForAPI = {
                systemInstruction :PERSONAS[currentPersona].systemPrompt,
                history: [...chatHistories[currentPersona],userMessage]
            };
            console.log("Sending to LLM API Route:",fullPaylaodForAPI);

            await new Promise(resolve => setTimeout(resolve,1000));

            const simulatedResponse = {
                role:'Mentor',
                content :`Response from ${PERSONAS[currentPersona].name} to: "${text}"`
            };

            setChatHistories(prev => ({
                ...prev,
                [currentPersona] : [...prev[currentPersona],simulatedResponse]
            }));
        } catch (error){
            console.error("API error :",error);
        }finally {
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
                <ChatFeed messages={chatHistories[currentPersona]}/>

                <ChatInput 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                currentPersona={currentPersona} />
            </div>
        </div>
    )
// }