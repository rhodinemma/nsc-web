"use client";
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { toast } from "sonner";


const LevelEightPage: React.FC = () => {
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://games-5qkr.onrender.com') {
                return;
            }

            //failed or completed 
            console.log('Message received from iframe:', event.data);

            if(event.data === 'completed'){
                toast.success('Level 8 completed!');
            }else{
                toast.error('Level 8 failed!. Please try again');
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <>
            <Navbar/>
            <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <iframe
                    src="https://games-5qkr.onrender.com/bird?lang=en&level=8"
                    style={{ width: '95%', height: '95%' }}
                    frameBorder="0"
                    allowFullScreen
                    title="Level Eight Game"
                ></iframe>
            </div>
        </>
    );
};

export default LevelEightPage;