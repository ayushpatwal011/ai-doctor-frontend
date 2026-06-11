import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Chat() {

    const { doctorId } = useParams();
    const navigate = useNavigate();
    const decodedDoctorId = decodeURIComponent(doctorId);

    const [messages, setMessages] = useState([{
        role: 'model',
        content: "Hi! How can I help you?"
    }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const apiUrl = import.meta.env.BACKEND_URL || 'https://ai-doctor-backend.vercel.app';
            const response = await fetch(`${apiUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentMessage: userMsg,
                    history: messages,
                    doctorType: decodedDoctorId
                })
            });

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', content: "Connection error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <button className="back-btn" onClick={() => navigate('/')} title="Back to menu">
                    <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
                <div className="chat-header-info">
                    <span className="chat-title">{decodedDoctorId}</span>
                    <span className="chat-status">Online and ready</span>
                </div>
            </div>

            <div className="messages-area">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
                        {msg.role === 'model' || msg.role === 'bot' ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                            </ReactMarkdown>
                        ) : (
                            msg.content
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="message bot">
                        <div className="loading-dots">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={sendMessage}>
                <input
                    type="text"
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your symptoms here..."
                    disabled={loading}
                />
                <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
                    <Send size={22} strokeWidth={2} />
                </button>
            </form>
        </div>
    );
}
