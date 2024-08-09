// src/components/Rooms.js
import React from 'react';
import { fetchRooms } from '../api';
import { useChat } from '../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Box, Alert } from '@mui/material';
import { styled } from '@mui/system';

const RoomsContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
});

const StyledListItem = styled(ListItem)({
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
});

const Rooms = () => {
    const [rooms, setRooms] = React.useState([]);
    const [error, setError] = React.useState(null);
    const { connectToRoom } = useChat();
    const navigate = useNavigate();

    React.useEffect(() => {
        const getRooms = async () => {
            try {
                const response = await fetchRooms();
                setRooms(response);
            } catch (error) {
                setError('Failed to load rooms. Please try again later.');
                console.error('Error fetching rooms:', error);
            }
        };

        getRooms();
    }, []);

    const handleRoomClick = (room) => {
        connectToRoom(room.slug);
        navigate(`/messages/${room.slug}`);
    };

    return (
        <RoomsContainer>
            <Typography component="h2" variant="h5" gutterBottom>
                Rooms
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <List>
                {rooms?.length && rooms.map(room => (
                    <StyledListItem key={room.id} onClick={() => handleRoomClick(room)}>
                        <ListItemText primary={room.name} />
                    </StyledListItem>
                ))}
            </List>
        </RoomsContainer>
    );
};

export default Rooms;
