$(document).ready(function() {

	const token = sessionStorage.getItem('auth_token')
	const user_id = sessionStorage.getItem('user_id')

	const chat_id = getCurrentChat()
	const endpoint = `ws://127.0.0.1:8000/api/v1/chats/${chat_id}/messages/`;
	const socket = new ReconnectingWebSocket(endpoint);

	const formData = $('#form')
	const msgInput = $('#id_message')
	const chatHolder = $('#chat-items')

	const options = {
        method: 'GET',
        headers: {
          "Authorization": `Token ${token}`
        }
    }

	fetch(
	    `http://127.0.0.1:8000/api/v1/chats/${chat_id}/messages/`, options
	)
	.then(res => res.json())
	.then(data => {
		if (!data[0]) {
			chatHolder.append(emptyChatMessage());
		} else {
		    data.map(function(item, index, array) {
				if (item.sender.id == user_id) {
					msg = outputMessage(item.id, item.sender.username, item.message, item.timestamp)
				} else {
					msg = inputMessage(item.id, item.sender.username, item.message, item.timestamp)
				}

				chatHolder.append(msg);
				scrollToEnd();
			})
		}
	})


	scrollToEnd();
	msgInput.focus();

	formData.submit(function(event) {
		event.preventDefault();
		msgText = msgInput.val()
		dataOnSend = {
			'event': 'sendMessage',
			'message': msgText
		}
		socket.send(JSON.stringify(dataOnSend))
		formData[0].reset()
		msgInput.focus();
	});


	socket.onmessage = function(e) {
		let BackEndData = JSON.parse(e.data)
		
		if (BackEndData.message !== '') {
			if ($('#emptyChat').attr('id')) {
				console.log($(this).attr('id'))
				chatHolder.empty()
			}
			if (BackEndData.message.user_id == user_id) {
				msg = outputMessage(BackEndData.message.id, BackEndData.message.username, BackEndData.message.message, BackEndData.message.timestamp)
			} else {
				msg = inputMessage(BackEndData.message.id, BackEndData.message.username, BackEndData.message.message, BackEndData.message.timestamp)
			}

			chatHolder.append(msg);
			scrollToEnd();
		}
		
	}


	socket.onopen = function(e) {
		socket.send(JSON.stringify({
			'event': 'authorization',
			'token': token,
		}))
		console.log('open', e)
	}

	socket.onerror = function(e) {
		console.log('error', e)
	}

	socket.onclose = function(e) {
		console.log('close', e)
	}

    function getCurrentChat() {
        q = window.location.href.split('/')
        last = Number(q.pop().split('=').pop())
		if (isNaN(last))
			window.location.href = FRONT_URLS['404']
        return last
    }

    function scrollToEnd() {
        $('#chat-items').stop().animate({
            scrollTop: $('#chat-items')[0].scrollHeight
        }, 200);
    }

	function twoSymbolsFormat(num) {
		str = String(num)
		if (str.length !== 2) {
			return '0' + str
		}
		return str
	}

	dateFormat = (date) => {
		js_date = new Date(date)
		hours = twoSymbolsFormat(js_date.getHours())
		minutes = twoSymbolsFormat(js_date.getMinutes())
		day = twoSymbolsFormat(js_date.getDate())
		month = twoSymbolsFormat(js_date.getMonth())
		year = js_date.getFullYear()
		return `${hours}:${minutes} | ${day} ${month} ${year}`
	}

	function emptyChatMessage() {
		return `
			<div id="emptyChat" class="d-flex flex-column align-items-center justify-content-center h-100 w-100">
				<h4>Здесь пока пусто...</h4>
				<h5>Начните общаться первым!</h5>
			<div>
		`
	}

    function outputMessage(id, username, message, timestamp) {
		date = dateFormat(timestamp)
        return `
            <div class="message media ml-auto mb-3">
                <div id="chat-messages-card" class="media ml-auto mb-3" data-message-id='${id}'>
                  <div class="media-body">
                    ${username}
                    <div class="msg d-flex justify-content-between bg-primary rounded py-2 px-3 mb-2">
                        <p id="text_message" class="text-small mb-0 text-white">${message}</p>
                    </div>
                    <p class="small text-muted">${date}</p>
                  </div>
                </div>
            </div>
        `
    }

    function inputMessage(id, username, message, timestamp) {
		date = dateFormat(timestamp)
        return `
            <div class="message media ml-auto mb-3">
                <div id="chat-messages-card" class="media mb-3" data-message-id='${id}'>
                  <div class="media-body ml-3">
                    ${username}
                    <div class="msg d-flex justify-content-between bg-light rounded py-2 px-3 mb-2">
                        <p id="text_message" class="text-small mb-0 text-muted">${message}</p>
                    </div>
                    <p class="small text-muted">${date}</p>
                  </div>
                </div>
            </div>
        `
    }
});