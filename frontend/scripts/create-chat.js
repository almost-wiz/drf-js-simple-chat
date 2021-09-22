$(document).ready(function() {

    const token = sessionStorage.getItem('auth_token')
    const user_id = sessionStorage.getItem('user_id')

    const form = $('form')
    const errorsHolder = $('#errorsHolder')
    const membersHolder = $('#membersHolder')
    const paginationHolder = $('#paginationHolder')
    const title = $('#title')

    let options = {
        method: 'GET',
        headers: {
          "Authorization": `Token ${token}`
        }
    }

    let query = CONSTANT_API_URLS['users']
    let currentPage = getCurrentPage(query)

    getData(query)


    function alertFetchResults(data) {
        membersHolder.empty()
        data.results.map(function(item, index, array) {
            membersHolder.append(userCard(item.id, item.first_name, item.last_name, item.avatar))
        });

        if (data.isPaginated) {
            paginationHolder.empty().append(pagination(data))
            $('#previous-page').click(() => {
                getData(data.links.previous)
            })
            $('#next-page').click(() => {
                getData(data.links.next)
            })
            $('.change-definite-page').click(function() {
                nextPage = $(this).attr('data-page')
                if (nextPage == currentPage)
                    return false
                nextLink = CONSTANT_API_URLS['users'] + `?page=${nextPage}`
                getData(nextLink)
            })
        }
    }

    function getData(link) {
        currentPage = getCurrentPage(link)
        if (currentPage)
            fetch(link, options).then(res => res.json()).then(data => alertFetchResults(data))
    }

    function getCurrentPage(query) {
        if (query == null)
            return false
        q = query.split('/')
        last = Number(q.pop().split('=').pop())
        return last || 1
    }

    function pagination(data) {
        li_str = ''
        previousBtnDisabled = ''
        nexBtnDisabled = ''
        totalPages = Math.ceil(data.count / data.pageSize)
        for (let i = 1; i <= totalPages; i++) {
            active = ''
            if (i == currentPage)
                active = ' bg-primary text-white'
            li_str += `
                <li class="page-item change-definite-page" data-page=${i}>
                    <button type='button' class="page-link${active}">${i}</button>
                </li>`
        }

        return `
            <ul class="pagination justify-content-center">
                <li class="page-item" id="previous-page">
                    <button type='button' class="page-link" aria-label="Previous"${previousBtnDisabled}>
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                    </button>
                </li>
                ${li_str}
                <li class="page-item" id="next-page">
                    <button type='button' class="page-link" aria-label="Next"${nexBtnDisabled}>
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                    </button>
                </li>
            </ul>
        `
    }

    

    form.submit(function(e) {
        e.preventDefault();

        if (membersHolder.find('input:checkbox:checked').length == 0) {
            errorsHolder.empty().append(`<p class='text-danger text-center'>Проверьте правильность введенных данных или повторите позже</p>`)
            return false
        }
        
        const data = new FormData()
        data.append('owner', user_id)
        data.append('title', title.val())

        data.append('members', user_id)
        membersHolder.find('input:checkbox:checked').each(function(){
            data.append('members', Number($(this).attr('data-check')))
        });

        options = {
            method: 'POST',
            body: data,
            headers: {
                "Authorization": `Token ${token}`
            }
        }
        fetch(CONSTANT_API_URLS['chat_create'], options)
        .then(res => res.json())
        .then(data => {
            if (data.id) {
                window.location.href = FRONT_URLS['chat_room'] + `?id=${data.id}`
            } else {
                errorsHolder.empty().append(`<p class='text-danger text-center'>Проверьте правильность введенных данных или повторите позже</p>`)
            }
        })
    });

    function userCard(id, first_name, last_name, avatar) {
        return `
            <div class="col-lg-4 mt-3">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-start">
                        <div>
                            <img src="${avatar}"  class="img-thumbnail avatar-small" id='avatar-img'>
                            <label class="font-weight-bold m-0" for="check-${id}">${first_name} ${last_name}</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="check-${id}" data-check=${id}>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

});