import React from 'react'

export default function SenderMessage({ message, username, time }) {
  return (
    <div className="flex flex-col items-end mt-3">
      <span className="text-xs text-indigo-500">{username} <span className="ml-0.5 text-slate-400">{time}</span></span>
      <p className="bg-indigo-500 rounded-lg p-3 text-white max-w-xs sm:max-w-md">
        {message}
      </p>      
    </div>
  )
}
