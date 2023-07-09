export const generateMessage = (text, username = 'Admin') => {
    return {
        text,
        username,
        createdAt: new Date().getTime(),
    }
}

export const generateLocationMessage = ({url, username}) => {
    return {
        url,
        createdAt: new Date().getTime(),
        username
    }
}
