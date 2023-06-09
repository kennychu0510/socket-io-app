import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Socket, io } from 'socket.io-client';
import { socket } from './socket';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  function addMessage(message: string) {
    setMessages(messages => [...messages, message]);
  }

  function onSendMessage() {
    if (!inputRef.current?.value) return;
    const message = inputRef.current.value;
    addMessage(message);
    inputRef.current.value = '';
    socket.emit('send-message', message)
  }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      addMessage('Connected with ID: ' + socket.id)
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    function onReceiveMessage(message: string) {
      addMessage(message);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive-message', onReceiveMessage)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive-message', onReceiveMessage)
    };
  }, [])
  return (
    <main>
      <div className='controller'>
        <div className='row'>
          <div className='label'>Message</div>
          <input type='text' ref={inputRef} />
          <button onClick={onSendMessage}>Send</button>
        </div>
        <div className='row'>
          <div className='label'>Room</div>
          <input type='text' />
          <button>Enter</button>
        </div>
      </div>
      <div className='content-display'>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default App;
