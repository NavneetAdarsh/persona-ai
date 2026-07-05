import { PERSONAS } from "../config/personas";

export default function PersonaToggle({currentPersona,setCurrentPersona}){
    return (
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200">{
            Object.values(PERSONAS).map((persona)=>{
                const isActive = currentPersona === persona.id;
                return (
                    <button
                     key = {persona.id}
                     onClick = {()=>setCurrentPersona(persona.id)}
                     className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${isActive
                        ? `${persona.themeColor} text-white shadow`
                        : 'text-slate-600 hover:text-slate-900'
                     }`}
                    >
                        {persona.name}
                    </button>
                );
            })
        }</div>
    );
}