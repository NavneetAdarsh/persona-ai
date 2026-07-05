import {useEffect,useRef} from 'react';


export default function ChatFeed({messages}){
    const bottomRef = useRef(null);

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior:'smooth'})
    },[messages] );

    return (
        <div className='flex-1 overflow-y-auto p-4 space-y-4 min-h-400px max-h-60vh bg-slate-50 rounded-xl border border-slate-200'>
            {messages.map((msg,index) =>{
            const isUser = msg.role === 'user';
             return (
                <div key ={index} className={`flex ${isUser ? 'justfiy-end' : 'justify-start'}`}>
                    <div 
                    className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                        isUser
                        ? 'bg-slate-700 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                    }`}
                    >
                    {msg.content}
                    </div>
                </div>
             );

})}
    <div ref={bottomRef}/>
        </div>
    )
}