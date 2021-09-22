$(document).ready(function() {

    const form = $('form')
    const errorsHolder = $('#errorsHolder')
    const first_name = $('#name');
    const last_name = $('#sername');
    const username = $('#username');
    const password = $('#password');


    form.submit(function(e) {
        e.preventDefault();

        const options = {
            method: 'POST',
            body: JSON.stringify({
                first_name: first_name.val(),
                last_name: last_name.val(),
                username: username.val(),
                password: password.val(),
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
        }
        fetch(
            CONSTANT_API_URLS['registration'], options
        )
        .then(res => res.json())
        .then(data => {
            if (data) {
                window.location.href = FRONT_URLS['login']
            } else {
                errorsHolder.empty().append(`<p class='text-danger text-center'>Проверьте правильность введенных данных или повторите позже</p>`)
            }
        })
    });

});