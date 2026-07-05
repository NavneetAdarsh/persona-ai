import {useState} from 'react';
import { PERSONAS } from '../config/personas';


export default function ChatInput({onSendMessage,isLoading,currentPersona}){
    const [text,setText] = useState('');
    const activePersona = PERSONAS[currentPersona];

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!text.trim() || isLoading) return;
        onSendMessage(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className='flex gap-2'>
            <input type="text"
            value={text}
            placeholder={`Message ${activePersona.name}...`}
            disabled = {isLoading}
            onChange={(e)=> setText(e.target.value)}
            className = {`flex-1 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 ${activePersona.accentColor} disabled:bg-slate-50`}
             />
             <button type="submit"
             disabled = {isLoading || !text.trim()}
             className={`text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors disabled:bg-slate-300 ${activePersona.themeColor}`}
             >
                {isLoading ? '...' : 'Send'}
             </button>
        </form>
    );
}