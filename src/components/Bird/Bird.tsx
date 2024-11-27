/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import './Bird.css';
import Image from 'next/image';

interface BirdProps {
    frame: number;
    position: { x: number; y: number };
}


//Frames are factors of 9

const Bird: React.FC<BirdProps> = ({ frame, position }) => {
    return (
        <div style={{
            maxHeight: '20dvh',
            width: '40dvw',
            position: 'relative',
            left : '-7dvw',
            top : '20dvh',
            zIndex: 1,
        }}>
            <img
            src="/challengeicons/bird.png"
            width={87}
            height={108}
            style={{
                left : `${position.x}dvw`,
                position : 'relative',
                top : `${position.y}dvh`,
                objectFit: 'none',
                objectPosition: `${frame}% 0%`,
                transition: `top 1.8s, left 1.8s`,
            }}
            alt="Marker"
            />
        </div>
        
    );
};

export default Bird;
