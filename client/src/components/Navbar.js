import React from 'react'
import { MdOutlineExitToApp } from 'react-icons/md'
import { SiGoogleclassroom } from 'react-icons/si'
import { useNavigate } from 'react-router-dom';
import socket from '../services/socket'

export default function Navbar({ room }) {
  const navigate = useNavigate()

  function leaveRoom() {
    socket.emit('leave', { room })
    navigate('/')
  }

  return (
    <div className="w-full h-12 bg-indigo-600 flex justify-between items-center px-5 shadow-md">
      <div className="flex justify-center items-center text-white text-xl">
        <SiGoogleclassroom className="mr-2" />
        <h1 className="font-bold">{room}</h1>
      </div>      
      <button type="button" onClick={leaveRoom} className="bg-indigo-400 rounded-md text-white px-2 text-lg flex items-center transition delay-75 hover:bg-indigo-500">
        Leave
        <MdOutlineExitToApp className="ml-1.5" />
      </button>
    </div>
  )
}
