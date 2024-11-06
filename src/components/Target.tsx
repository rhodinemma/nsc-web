/* eslint-disable @next/next/no-img-element */
import React from "react";

interface Position{
    top : string;
    right : string;
}

export const Target = ({top , right} : Position) => {
    return (
        <>
            <img
            src="/challengeicons/marker.png"
            width={20}
            height={30}
            style={{
                position : 'relative',
                top : top,
                right : right,
            }}
            alt="Marker"
            />
        </>
    )
}

export default Target