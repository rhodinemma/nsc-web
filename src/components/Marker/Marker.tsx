/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import './Marker.css';
import Image from 'next/image';

interface MarkerProps {
    frame: number;
    position: { x: number; y: number };
}


//Frames are factors of 15

const Marker: React.FC<MarkerProps> = ({ frame, position }) => {
    return (
        <div style={{
            maxHeight: '20dvh',
            width: '40dvw',
            position: 'relative',
            left : '4dvw',
            top : '-6dvh',
        }}>
            <img
            src="/challengeicons/pegman.png"
            width={55}
            height={500}
            style={{
                left : `${position.x}dvw`,
                position : 'relative',
                top : `${position.y}dvh`,
                objectFit: 'none',
                objectPosition: `${frame}% 0%`,
                transition: `top 0.3s, left 0.3s`
            }}
            alt="Marker"
            />
        </div>
        
    );
};

export default Marker;
