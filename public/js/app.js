const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageInput = $messageForm.querySelector('input');
const $messageFormBtn  = $messageForm.querySelector('button');
const $sendLocationBtn = document.querySelector('#sendLocation');
const $messages = document.getElementById('messages');
const $sidebar = document.getElementById('sidebar');

// templates
const messageTemplate = Handlebars.compile(document.getElementById('message-template').innerHTML);
const locationTemplate = Handlebars.compile(document.getElementById('location-template').innerHTML);
const sidebarTemplate = Handlebars.compile(document.getElementById('sidebar-template').innerHTML);

// options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoScroll = () => {
    console.log('called');
    const $newMessage = $messages.lastElementChild;

    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMarging = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight  = $newMessage.offsetHeight + newMessageMarging;

    const visibaleHeight = $messages.offsetHeight;
    const contentHeight = $messages.scrollHeight;
    const scrollOffset = $messages.scrollTop + visibaleHeight;

    if (contentHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}

socket.on('message', (message) => {
    const html = messageTemplate({
        message: message.text, 
        createdAt: moment(message.createdAt).format('h:mm a'), 
        username: message.username    
    });

    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($messageInput.value) {
        $messageFormBtn.setAttribute('disabled', 'disabled');

        const message = $messageInput.value;
        $messageInput.value = '';
        $messageInput.focus();
        socket.emit('messageSent', message, (error) => {
            $messageFormBtn.removeAttribute('disabled');

            if (error) {
                $messageInput.focus();
                return;
            }
        });
    }
});

socket.on('locationMessage', (message) => {
    const html = locationTemplate({
        url: message.url, 
        createdAt: moment(message.createdAt).format('h:mm a'), 
        username: message.username
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoScroll();
});

socket.on('roomData', ({room, users}) => {
    const html = sidebarTemplate({
        users,
        room
    });
    $sidebar.innerHTML = html
})

$sendLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not enabled for your browser.')
    }
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
    
    $sendLocationBtn.setAttribute('disabled', 'disabled');

    function success(pos) {
        const {latitude, longitude} = pos.coords;
        
        socket.emit('sendLocation', { latitude, longitude }, (error) => {
            $sendLocationBtn.removeAttribute('disabled');
            
            if (error) {
                return console.error(response.error);
            }
        })
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        $sendLocationBtn.removeAttribute('disabled');
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
});

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href ='/';
    }
});