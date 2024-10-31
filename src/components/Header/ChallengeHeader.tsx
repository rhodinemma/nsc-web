import React from "react";
// import Image from 'next/image'
import {Typography} from '@mui/material'
import './header.css'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';

export const Header = () => {

    return (
        <div className="header">
            <div className="titleContent">
                {/* <Image src="/icons/maze.jpg" alt="logo" width={50} height={50}/> */}
                <Typography variant="h4" className="title">NSC</Typography>
            </div>  

            <div className="Actions">
                <a href="/dashboard" className="link">Dashboard</a>
                <a href="/blockly" className="link">Code Challenge</a>
                <a href="/scratch" className="link">Build a project</a>
                <a href="/account" className="link">Account</a>
            </div>

            <div className="user">
                <SupervisedUserCircleIcon/>
                <CircleNotificationsIcon/>
                <SignalWifiStatusbar4BarIcon/>
            </div>
        </div>
    )
}

export default Header