$(document).ready(function() {

    const form = $('form')
    const errorsHolder = $('#errorsHolder')
    const username = $('#username');
    const password = $('#password');


    form.submit(function(e) {
        e.preventDefault();

        const options = {
            method: 'POST',
            body: JSON.stringify({
                username: username.val(),
                password: password.val(),
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
        fetch(
            CONSTANT_API_URLS['login'], options
        )
        .then(res => res.json())
        .then(data => {
            if (data.auth_token) {
                sessionStorage.setItem('auth_token', data.auth_token)
                sessionStorage.setItem('user_id', data.user_id)
                window.location.href = FRONT_URLS['chats']
            } else {
                errorsHolder.empty().append(`<p class='text-danger text-center'>Проверьте правильность введенных данных или повторите позже</p>`)
            }
        })
    });

});