const api_host = 'http://127.0.0.1:8000/'
const api_v = 'api/v1/'
const api_prefix = api_host + api_v

const CONSTANT_API_URLS = {
    'login': api_prefix + 'auth/login/',
    'logout': api_prefix + 'auth/token/logout/',
    'registration': api_prefix + 'auth/users/',
    'chats': api_prefix + 'chats/',
    'chat_create': api_prefix + 'chats/create/',
    'users': api_prefix + 'users/',
}

let fullUrl = document.currentScript.src.split('/');
fullUrl.pop()
fullUrl.pop()
const front_prefix = fullUrl.join('/') + '/'

const FRONT_URLS = {
    '403': front_prefix + 'errors/403.html',
    '404': front_prefix + 'errors/404.html',
    'login': front_prefix + 'index.html',
    'logout': front_prefix + 'logout.html',
    'registration': front_prefix + 'registration.html',
    'chats': front_prefix + 'chats.html',
    'chat_room': front_prefix + 'chat_room.html',
    'profile': front_prefix + 'profile.html',
}