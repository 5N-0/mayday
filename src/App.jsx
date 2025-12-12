import React, { Suspense } from 'react';
import Experience from './components/Experience';
import UI from './components/UI';
import HandTracker from './components/HandTracker';
import { useStore } from './store/useStore';

function App() {
    const { cameraEnabled } = useStore();

    return (
        <div className="w-full h-full relative">
            <Suspense fallback={<div className="text-christmas-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-2xl">Loading Christmas Magic...</div>}>
                <Experience />
            </Suspense>

            <UI />

            {cameraEnabled && <HandTracker />}
        </div>
    );
}

export default App;
