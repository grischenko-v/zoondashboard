(function(){
	var states = ['purple', 'orange', 'gray'];
	var template = document.querySelectorAll(".card")[0];
	var cards = document.querySelector(".cards");
	var appState = {
		rating: 0,
		review: 0,
		reply: 0,
		update: 0
	}

	function r(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function getRandomObject() {
		var obj = jsonData[Math.floor(Math.random() * jsonData.length)];
		Object.assign(obj, {
			state: states[Math.floor(Math.random() * states.length)],
			rating: r(1, 5),
			review: r(0, 200),
			reply: r(0, 20),
			update: r(0, 5)
		});

		return obj;
	}

	var jsonData = [{
		id: 1,
		title: 'Google',
		state: 'purple',
		rating: 5, // рейтинг
		review: 4, // отзывы
		reply: 3, // неотвеченные
		update: 2 // обновления
	},{
		id: 2,
		title: 'Yandex',
		state: 'gray',
		rating: 4,
		review: 3,
		reply: 2,
		update: 1
	},{
		id: 3,
		title: 'Rambler',
		state: 'orange',
		rating: 3,
		review: 2,
		reply: 1,
		update: 0
	},{
		id: 4,
		title: '2gis',
		state: 'gray',
		rating: 2,
		review: 1,
		reply: 0,
		update: 0
	},{
		id: 5,
		title: 'Waze',
		state: 'gray',
		rating: 1,
		review: 0,
		reply: 0,
		update: 0
	}];

	setInterval(function(){
		var obj = getRandomObject();
		update(obj);
	}, r(10, 30) * 1000);


	function update(obj) {
		// @TODO обновлять состояние элементов + обновлять глобальные счётчики
		updateData(obj);
		deleteNodes();
		render();
	}

	function updateData(obj) {
		var changedItem = jsonData.filter((item => obj.id == item.id))[0];
		changedItem.state = obj.state;
		changedItem.rating = obj.rating;
		changedItem.review = obj.review;
		changedItem.reply = obj.reply;
		changedItem.update = obj.update;
	}

	function render() { 
		var fragment = new DocumentFragment();
		
		jsonData.sort((a, b) => { 
			if (a.state === 'gray') return -1;
			else if (a.state === 'orange' && b.state === 'purple') return -1;
			else if (a.state === 'orange' && b.state === 'gray') return 1;
			else return 0;
		}).forEach(data => nodeUpdate(data, fragment));
		cards.prepend(fragment);

		changeAppState();
	}

	function nodeUpdate(data, fragment) {
		var node = template.cloneNode(true);
		
		node.setAttribute('rerenderble', true);
		node.querySelector('.card__title').innerText = data.title;
		node.querySelector('.rating__countvalue').innerText = data.rating;
		node.querySelector('.rating__reviewscount').innerText = data.review;
		node.querySelector('.rating__noansweredcount').innerText = data.reply;
		node.querySelector('.rating__updatescount').innerText = data.update;
		node.style.borderLeftColor = data.state;
		fragment.prepend(node);
	}

	function deleteNodes() {
		cards.querySelectorAll('.card').forEach(card => {
			if (card.getAttribute('rerenderble'))
				card.remove();
		})
	}

	function changeAppState() {
		appState = {
			rating: 0,
			review: 0,
			reply: 0,
			update: 0
		};
		jsonData.forEach(data => {
			appState.rating += data.rating;
			appState.review += data.review;
			appState.reply += data.reply;
			appState.update += data.update;
		});

		document.querySelector('.infoblock_reviews .infoblock__count').innerText = appState.review;
		document.querySelector('.infoblock_unanswered .infoblock__count').innerText = appState.reply;
		document.querySelector('.infoblock_updates .infoblock__count').innerText = appState.update;
		document.querySelector('.infoblock_rating .infoblock__count').innerText = appState.rating/jsonData.length;
	}

	render();
}());
