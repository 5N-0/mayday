import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function UI() {
    const { phase, handDetected, gesture, setPhase } = useStore();
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleMusic = () => {
        const audio = document.getElementById('bgm');
        if (audio) {
            if (isPlaying) audio.pause();
            else audio.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 font-serif">
            {/* Header */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center pointer-events-auto">
                <h1 className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-christmas-gold to-yellow-600 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)] font-serif">
                    Merry Christmas
                </h1>
                <p className="text-white/60 text-sm tracking-[0.5em] mt-2 uppercase">Interactive 3D Experience</p>
                <div className="mt-4 flex gap-2 justify-center">
                    <button onClick={() => setPhase('tree')} className="border border-christmas-gold/50 bg-black/30 px-4 py-1 rounded text-christmas-gold active:bg-christmas-gold/20 transition">Tree</button>
                    <button onClick={() => setPhase('nebula')} className="border border-christmas-gold/50 bg-black/30 px-4 py-1 rounded text-christmas-gold active:bg-christmas-gold/20 transition">Nebula</button>
                </div>
            </div>

            {/* Status Panel (Glassmorphism) */}
            <div className="absolute top-10 left-10 p-6 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-xl shadow-2xl w-64">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full ${handDetected ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`} />
                    <span className="text-white/80 text-sm font-bold tracking-widest">SYSTEM STATUS</span>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">PHASE</span>
                        <span className="text-christmas-gold font-bold uppercase">{phase}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">HAND</span>
                        <span className="text-white font-bold">{handDetected ? 'DETECTED' : 'SEARCHING...'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">GESTURE</span>
                        <span className="text-white font-bold">{gesture}</span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/40 leading-relaxed">
                    <p>Instructions:</p>
                    <ul className="list-disc ml-4 space-y-1 mt-1">
                        <li><b className="text-white">Open Palm</b>: Explode / Next</li>
                        <li><b className="text-white">Fist</b>: Reset / Close</li>
                    </ul>
                </div>
            </div>

            {/* Music Player */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
                <button
                    onClick={toggleMusic}
                    className={`flex items-center gap-4 px-6 py-3 rounded-full border border-christmas-gold/30 bg-black/40 backdrop-blur-md transition hover:bg-black/60 hover:border-christmas-gold ${isPlaying ? 'shadow-[0_0_30px_rgba(212,175,55,0.2)]' : ''}`}
                >
                    <div className={`text-2xl ${isPlaying ? 'animate-spin' : ''}`}>❄️</div>
                    <div className="text-left">
                        <div className="text-christmas-gold text-xs tracking-widest uppercase">Now Playing</div>
                        <div className="text-white text-sm font-serif">Merry Christmas Mr. Lawrence</div>
                    </div>
                </button>
                <audio id="bgm" loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
                {/* Note: User should replace src with local file if available */}
            </div>
        </div>
    );
}
