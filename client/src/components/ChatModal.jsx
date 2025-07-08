"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MessageList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { useUser } from '@/context/UserContext';

export default function ChatModal({ open, onClose }) {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentRoll, setStudentRoll] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Prefer context, fallback to localStorage
    if (user && user.roll) {
      setStudentRoll(user.roll);
    } else if (typeof window !== 'undefined') {
      setStudentRoll(localStorage.getItem('student_roll') || '');
    }
  }, [user]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const sendMessage = async () => {
    if (!input.trim() || !studentRoll) return;
    const userMsg = {
      position: 'right',
      type: 'text',
      text: input,
      date: new Date(),
      className: 'user-message-bubble',
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/agent/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, student_roll: studentRoll }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        {
          position: 'left',
          type: 'text',
          text: data.response,
          date: new Date(),
          className: 'bot-message-bubble',
        },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        {
          position: 'left',
          type: 'text',
          text: 'Error contacting server.',
          date: new Date(),
          className: 'bot-message-bubble',
        },
      ]);
    } finally {
      setLoading(false);
      setInput('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      <style>{`
        .ng-chat-modal-box {
          background: #232946;
          color: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 16px #2229;
          padding: 0;
          width: 400px;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .ng-chat-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px 8px 24px;
        }
        .ng-chat-modal-header h3 {
          margin: 0;
          color: #fff;
        }
        .ng-chat-modal-close {
          font-size: 28px;
          background: #2e3350;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 4px #0001;
        }
        .ng-chat-modal-messages {
          flex: 1;
          min-height: 300px;
          overflow-y: auto;
          margin: 0 0 0 0;
          padding: 0 24px 0 24px;
        }
        .ng-chat-modal-input-row {
          display: flex;
          gap: 8px;
          padding: 16px 24px 24px 24px;
          background: #232946;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
          align-items: center;
        }
        .ng-chat-input {
          flex: 1;
          background: #2e3350;
          color: #fff;
          border: 1px solid #3e4a6d;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 16px;
          outline: none;
        }
        .ng-chat-input::placeholder {
          color: #b8b8d1;
        }
        .ng-chat-send-btn {
          background: #3e4a6d;
          color: #fff;
          border-radius: 8px;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ng-chat-send-btn:disabled {
          background: #555a7b;
          cursor: not-allowed;
        }
        .user-message-bubble .rce-mbox {
          background: #3e4a6d !important;
          color: #fff !important;
        }
        .bot-message-bubble .rce-mbox {
          background: #eebbc3 !important;
          color: #232946 !important;
        }
      `}</style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="ng-chat-modal-box">
          <div className="ng-chat-modal-header">
            <h3>Doubt Solving Chat</h3>
            <button onClick={onClose} aria-label="Close chat window" className="ng-chat-modal-close">&times;</button>
          </div>
          <div className="ng-chat-modal-messages">
            <MessageList
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={messages}
            />
          </div>
          <div className="ng-chat-modal-input-row">
            <input
              ref={inputRef}
              className="ng-chat-input"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
            />
            <button
              className="ng-chat-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim() || !studentRoll}
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
          {!studentRoll && <div style={{color:'#eebbc3',marginTop:8, textAlign:'center'}}>Student roll number not found. Please login again.</div>}
        </div>
      </div>
    </>
  );
} 