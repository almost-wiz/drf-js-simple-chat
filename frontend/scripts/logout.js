$(document).ready(function() {

    const token = sessionStorage.getItem('auth_token')

    const form = $('form')


    form.submit(function(e) {
        e.preventDefault();

        const options = {
            method: 'POST',
            headers: {
                "Authorization": `Token ${token}`
            }
        }
        fetch(
            CONSTANT_API_URLS['logout'], options
        )
        .then(() => {
            sessionStorage.removeItem('auth_token')
            sessionStorage.removeItem('user_id')
            window.location.href = FRONT_URLS['login']
        })
    });

});