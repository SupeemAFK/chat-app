import React from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import ChatApp from './components/ChatApp'
import Dashboard from "./components/Dashboard"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/">
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<ChatApp />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
