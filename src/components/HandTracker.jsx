import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { useStore } from '../store/useStore';

export default function HandTracker() {
    const videoRef = useRef();
    const [running, setRunning] = useState(false);
    const { setHandState, setPhase, phase, cameraEnabled } = useStore();
    const handLandmarkerRef = useRef();

    useEffect(() => {
        let handLandmarker;
        let animationFrameId;

        const startVision = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
            );
            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numHands: 1
            });
            handLandmarkerRef.current = handLandmarker;
            setRunning(true);
        };
        startVision();

        return () => {
            // Cleanup if needed
        };
    }, []);

    useEffect(() => {
        if (running && cameraEnabled) {
            enableCam();
        } else {
            // stop cam
        }
    }, [running, cameraEnabled]);

    const enableCam = async () => {
        if (!handLandmarkerRef.current) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener('loadeddata', predictWebcam);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const predictWebcam = async () => {
        if (!videoRef.current || !handLandmarkerRef.current) return;

        let startTimeMs = performance.now();
        if (videoRef.current.currentTime > 0) {
            const results = handLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

            if (results.landmarks && results.landmarks.length > 0) {
                const lm = results.landmarks[0];

                // Gesture Logic
                // 1. Open Palm (All fingers up) vs Fist
                const tipIds = [8, 12, 16, 20];
                const baseIds = [5, 9, 13, 17];
                let openCount = 0;
                // Assuming hand is upright. Or use distance from wrist (0).
                // Simple dist check: dist(tip, 0) > dist(base, 0) * 1.5

                const wrist = lm[0];
                const dist = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

                tipIds.forEach((tip, i) => {
                    if (dist(lm[tip], wrist) > dist(lm[baseIds[i]], wrist) * 1.2) openCount++;
                });

                let gesture = 'NONE';
                if (openCount >= 4) gesture = 'OPEN_PALM';
                else if (openCount <= 1) gesture = 'CLOSED_FIST';

                setHandState(true, gesture);

                // Phase Transition Logic
                // Debouncing is usually good, but let's do direct triggers for now
                if (gesture === 'OPEN_PALM') {
                    if (phase === 'tree') setPhase('blooming');
                    // if nebula, scroll logic handled in store or component
                } else if (gesture === 'CLOSED_FIST') {
                    if (phase === 'nebula') setPhase('collapsing');
                }

            } else {
                setHandState(false, 'NONE');
            }
        }

        if (cameraEnabled) requestAnimationFrame(predictWebcam);
    };

    return (
        <div className="absolute top-10 right-10 w-48 h-36 bg-black/50 border border-christmas-gold/30 rounded-xl overflow-hidden glass-panel backdrop-blur-md z-50">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover opacity-80 -scale-x-100"
            />
            <div className="absolute bottom-2 left-2 text-[10px] text-white/50">CAMERA PREVIEW</div>
        </div>
    );
}
