import React, { useState } from 'react'
import { BsChatDotsFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import socket from '../services/socket'

export default function Dashboard() {
  const [joinForm, setJoinForm] = useState({ username: '', room: '' })
  const navigate = useNavigate();

  function handleOnChange(e) {
    const name = e.target.name
    const value = e.target.value
    setJoinForm({ ...joinForm, [name]: value })
  }

  function joinRoom() {
    socket.emit("join", joinForm)
    navigate(`/chat?username=${joinForm.username}&room=${joinForm.room}`)
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col sm:flex-row">
      <div className="flex flex-col items-center my-5 sm:mr-5"> 
        <div className="w-52 sm:96">
          <img className="object-cover w-full" src="/talkup-removebg-preview.png" alt="logo" />
        </div>
        <h1 className="text-violet-700 text-3xl font-bold">JUST TALK</h1>
      </div>
      <div className="bg-indigo-600 p-3 rounded-md w-60 sm:w-96">
        <input className="w-full h-10 rounded px-4" onChange={handleOnChange} type="text" name="username" placeholder="Username" />
        <input className="w-full h-10 mt-2 rounded px-4" onChange={handleOnChange} type="text" name="room" placeholder="Enter room" />
        <button onClick={joinRoom} className="mt-2 p-2 w-full bg-indigo-400 text-white rounded-md flex justify-center items-center" type="button">
          JOIN
          <BsChatDotsFill className="ml-2" />
        </button>
      </div>
    </div>
  )
}
