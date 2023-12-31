const users = [];

export const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    const existigUsers = users.find((user) => {
        return user.room === room && user.username === username;
    });

    if (existigUsers) {
        return {
            error: 'Username is in use'
        }
    }

    const user = {id, username, room };

    users.push(user);
    return {user};
}

export const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

export const getUser = (id) => {
    return users.find(user => user.id === id);
};

export const getUserInRoom = (room) => {
    room.toLowerCase().trim();
    return users.filter(user => user.room === room);
}
