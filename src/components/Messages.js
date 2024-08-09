// Update Messages component

import React, { useState, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useParams } from 'react-router-dom';
import { fetchMessages } from '../api';
import { Box, List, ListItem, ListItemText, TextField, Button, Typography, Paper } from '@mui/material';

const Messages = () => {
    const { roomSlug } = useParams();
    const { connectToRoom, sendMessage, markAsRead, messages } = useChat();
    const [message, setMessage] = useState('');
    const [oldMessages, setOldMessages] = useState([]);
    const username = localStorage.getItem('user')?.username || JSON.parse(localStorage.getItem('user')).username;

    useEffect(() => {
        connectToRoom(roomSlug);
        const loadMessages = async () => {
            const response = await fetchMessages(roomSlug);
            if (response.status !== 'error') {
                setOldMessages(response);
                const unreadMessageIds = response.filter(msg => !msg.is_read).map(msg => msg.id);
                if (unreadMessageIds.length > 0) {
                    markAsRead(unreadMessageIds);
                }
            }
        };

        loadMessages();
    }, [roomSlug, connectToRoom, markAsRead]);

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage({
                action: 'message',
                message,
                username,
                room_name: roomSlug,
            });
            setMessage('');
        }
    };

    return (
        <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', height: '90vh', width: '65%' }}>
            <Typography variant="h5" gutterBottom>
                Room: {roomSlug}
            </Typography>
            <Paper sx={{ flex: 1, overflow: 'auto', padding: 2, marginBottom: 2 }}>
                <List>
                    {oldMessages.map((msg, index) => (
                        <ListItem key={index} sx={{ justifyContent: msg.username === username ? 'flex-end' : 'flex-start' }}>
                            <Box sx={{
                                backgroundColor: msg.username === username ? '#dcf8c6' : '#f1f1f1',
                                padding: '10px',
                                borderRadius: '10px',
                                maxWidth: '70%',
                                boxShadow: 1,
                            }}>
                                <ListItemText primary={msg.username} secondary={msg.content} />
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Box sx={{ display: 'flex' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                    sx={{ marginRight: 1 }}
                />
                <Button variant="contained" color="primary" onClick={handleSendMessage}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Messages;
