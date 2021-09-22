$(document).ready(function() {

    const token = sessionStorage.getItem('auth_token')
    const user_id = sessionStorage.getItem('user_id')

    const chatsHolder = $('#chatsHolder')
    const paginationHolder = $('#paginationHolder')


    const options = {
        method: 'GET',
        headers: {
          "Authorization": `Token ${token}`
        }
    }

    let query = CONSTANT_API_URLS['chats']
    let currentPage = getCurrentPage(query)

    getData(query)

    function alertFetchResults(data) {
        chatsHolder.empty()
        data.results.map(function(item, index, array) {
            chatsHolder.append(chatCard(item.id, item.title, item.owner))
        });

        $('.card-body > #deleteChat').click(function() {
            deleteChat($(this))
        })

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
                nextLink = CONSTANT_API_URLS['chats'] + `?page=${nextPage}`
                getData(nextLink)
            })
        }
    }

    function getData(link) {
        currentPage = getCurrentPage(link)
        if (currentPage)
            fetch(link, options).then(res => res.json()).then(data => alertFetchResults(data))
    }

    function deleteChat(chat) {
        chat_id = $(chat).attr('data-id')
        fetch(
            `http://127.0.0.1:8000/api/v1/chats/${chat_id}/delete/`,
            {
                method: 'DELETE',
                headers: {
                  "Authorization": `Token ${token}`
                }
            }
        )
        .then(() => {
            $(chat).parent().parent().parent().remove()
        })
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

    function chatCard(id, title, owner) {
        actionsBtn = ''
        if (owner == user_id) {
            actionsBtn = `
                <a href="edit_chat.html?id=${id}" data-id=${id} class="btn btn-success">Изменить чат</a>
                <button type='button' id='deleteChat' data-id=${id} class="btn btn-danger">Удалить чат</button>
            `
        }
        return `
            <div class="col-lg-4 mt-3">
                <div class="card">
                    <h5 class="card-header">${title}</h5>
                    <div class="card-body d-flex justify-content-between">
                        <a href="chat_room.html?id=${id}" class="btn btn-primary">Написать</a>
                        ${actionsBtn}
                    </div>
                </div>
            </div>
        `
    }

});