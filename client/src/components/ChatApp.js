import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import Navbar from './Navbar'
import SenderMessage from './SenderMessage'
import ReceiveMessage from './ReceiveMessage';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import socket from '../services/socket'

export default function ChatApp() {
  const [message, setMessage] = useState("")
  const [isOpenSidebar, setIsOpenSidebar] = useState(false)
  const [messageList, setMessageList] = useState([])
  const [users, setUsers] = useState([])
  const messagesEndRef = useRef(null)

  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const room = searchParams.get("room")

  useEffect(() => {
    socket.on('user_joined', ({ users, newUser, time }) => {
      setUsers(users)
      const messageObj = { id: uuidv4(), message: `${newUser.username} has joined the ${room}`, time, alert: true }
      setMessageList((prevMessageList) => [...prevMessageList, messageObj ])
    })

    socket.on('user_left', ({ users, left_user, time }) => {
      setUsers(users)
      const messageObj = { id: uuidv4(), message: `${left_user.username} has left the ${room}`, time, alert: true }
      setMessageList((prevMessageList) => [...prevMessageList, messageObj ])
    })

    socket.on('receive-message', (messageObj) => {
      setMessageList((prevMessageList) => [...prevMessageList, messageObj ])
    })
  }, [])

  function handleOnSubmit(e) {
    e.preventDefault()
    if (message === '') return
    
    const user = { socketId: socket.id, username, room }
    const messageObj = { id: uuidv4(), message, user, time: moment().format('h:mm a') }

    socket.emit("send-message", { messageObj, room })
    setMessageList((prevMessageList) => [...prevMessageList, messageObj ])
    setMessage("")
  }

  useEffect(() => {
    scrollToBottom()
  }, [messageList])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <Navbar isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} room={room}/>
      <div className={`${isOpenSidebar ? "translate-x-0	" : "translate-x-[-100%]"} sm:translate-x-0 transition-all duration-200 w-40 h-screen fixed top-0 bg-indigo-400 shadow-md text-white z-[-1] py-20 flex flex-col items-center`}>
        <div className="flex flex-col items-center">
          <h1 className="flex items-center mb-2"><FaUsers className="mr-2" />USERS</h1>
          {users.map(user => <p key={user.socketId}>{user.username}</p>)}
        </div>
      </div>
      <div className="w-screen h-20 bg-indigo-500 fixed bottom-0 shadow-md flex items-center px-3">
        <input value={message} onChange={(e) => setMessage(e.target.value)} className="w-full outline-none rounded-lg transition delay-20 focus:border-2 border-green-500 px-5 py-2" />
        <button type="submit" className="bg-white rounded-md flex items-center p-1 ml-1">Send <FiSend className="ml-0.5" /></button>
      </div>
      <div className="fixed right-0 w-screen h-[calc(100%-8rem)] sm:w-[calc(100%-10rem)] -z-20 pt-2 pb-5 px-5 overflow-y-scroll	">
        {messageList.map(message => {
          if (message.alert) {
            return <p key={message.id} className="text-xs text-indigo-400 text-center">{message.message}</p>
          }
          if (message.user.socketId === socket.id ) {
            return <SenderMessage key={message.id} message={message.message} username={message.user.username} time={message.time} /> 
          }
          return <ReceiveMessage key={message.id} message={message.message} username={message.user.username} time={message.time} />
          })
        }
        <div ref={messagesEndRef} />
      </div>
    </form>
  )
}
