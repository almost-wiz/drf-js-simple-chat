$(document).ready(function() {

    const token = sessionStorage.getItem('auth_token')
    const user_id = sessionStorage.getItem('user_id')

    const form = $('form')
    const errorsHolder = $('#errorsHolder')
    const first_name = $('#name')
    const last_name = $('#sername')
    const avatar_img = $('#avatar-img')
    const avatar_input = $('#avatar-input')

    const options = {
        method: 'GET',
        headers: {
          "Authorization": `Token ${token}`
        }
    }

    fetch(
        `http://127.0.0.1:8000/api/v1/users/${user_id}/`, options
    )
    .then(res => res.json())
    .then(data => {
        first_name.val(data.first_name)
        last_name.val(data.last_name)
        avatar_img.attr('src', data.avatar)
    })

    

    form.submit(function(e) {
        e.preventDefault();
        
        const data = new FormData()
        if (avatar_input[0].files[0]) {
            data.append('avatar', avatar_input[0].files[0])
        }
        data.append('first_name', first_name.val())
        data.append('last_name', last_name.val())

        const options = {
            method: 'PUT',
            body: data,
            headers: {
              "Authorization": `Token ${token}`
            }
        }
        fetch(
            `http://127.0.0.1:8000/api/v1/users/${user_id}/edit/`, options
        )
        .then(res => res.json())
        .then(data => {
            if (data.first_name) {
                avatar_img.attr('src', data.avatar)
                errorsHolder.empty().append(`<p class='text-success text-center'>Данные успешно сохранены</p>`)
            } else {
                console.log(data)
                errorsHolder.empty().append(`<p class='text-danger text-center'>Проверьте правильность введенных данных или повторите позже</p>`)
            }
        })
    });

});