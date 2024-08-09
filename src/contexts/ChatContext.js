import React, { createContext, useState, useEffect, useContext } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const ChatContext = createContext();
// Update ChatProvider in React

const ChatProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState(null);
    const username = localStorage.getItem('user')?.username || JSON.parse(localStorage.getItem('user')).username;

    useEffect(() => {
        let socket = null;

        if (room) {
            socket = new W3CWebSocket(`ws://localhost:8000/ws/chat/${room}/`);
            setClient(socket);

            socket.onopen = () => {
                console.log('WebSocket Client Connected');
            };

            socket.onmessage = (message) => {
                const data = JSON.parse(message.data);
                if (data.action === 'user_joined') {
                    // Handle user joining the chat
                    markAsReadForAllMessages();
                } else {
                    setMessages((prevMessages) => [...prevMessages, data]);
                }
            };

            socket.onclose = () => {
                console.log('WebSocket Client Disconnected');
            };

            socket.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            return () => {
                if (socket) {
                    socket.close();
                }
            };
        }
    }, [room]);

    const connectToRoom = (roomName) => {
        if (room !== roomName) {
            setRoom(roomName);
            setMessages([]);
        }
    };

    const sendMessage = (data) => {
        if (client) {
            client.send(JSON.stringify(data));
        }
    };

    const markAsRead = (messageIds) => {
        if (client) {
            client.send(JSON.stringify({
                action: 'mark_as_read',
                message_ids: messageIds,
                room_name: room,
                username: username
            }));
        }
    };

    const markAsReadForAllMessages = () => {
        const unreadMessageIds = messages.filter(msg => !msg.is_read).map(msg => msg.id);
        if (unreadMessageIds.length > 0) {
            markAsRead(unreadMessageIds);
        }
    };

    return (
        <ChatContext.Provider value={{ messages, room, connectToRoom, sendMessage, markAsRead }}>
            {children}
        </ChatContext.Provider>
    );
};
