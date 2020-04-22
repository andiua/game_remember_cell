'use strict';

window.addEventListener('DOMContentLoaded', function () {
	
	const $gameField = document.getElementById('game_field'),
		$tries = document.getElementById('tries'),
		$gameLoose = document.getElementById('game_loose'),
		$gameBtn = document.querySelector('.game__play-btn'),
		$gamePopup = document.getElementById('game_popup');

		// додаємо поля яких не вистачає
	let	$gameFieldItems;
	if (window.matchMedia("(min-width: 1200px)").matches) {
		$gameField.insertAdjacentHTML('afterbegin', 
		`<span></span><span></span><span></span><span></span>
		<span></span><span></span><span></span><span></span>
		<span></span><span></span><span></span><span></span>
		<span></span><span></span><span></span><span></span>`);
		$gameFieldItems = $gameField.querySelectorAll('span');

	} else if (window.matchMedia("(min-width: 992px)").matches) {
		$gameField.insertAdjacentHTML('afterbegin', 
		`<span></span><span></span><span></span><span></span>
		<span></span><span></span><span></span><span></span>
		<span></span><span></span><span></span><span></span>`);
		$gameFieldItems = $gameField.querySelectorAll('span');

	} else if (window.matchMedia("(min-width: 576px)").matches) {
		$gameField.insertAdjacentHTML('afterbegin', 
		`<span></span><span></span><span></span><span></span>
		<span></span><span></span><span></span><span></span>
		`);
		$gameFieldItems = $gameField.querySelectorAll('span');

	} else {
		$gameFieldItems = $gameField.querySelectorAll('span');
	}

	// параметри
	let triesCount = 3;
	let activeBlocks = 5;
	let clickCount;
	let timeActive = 1500;
	let userActiveBlocksCount;
	let temporaryActiveItems = [];

	const randomItemsField = () => Math.floor(Math.random() * ($gameFieldItems.length));
	
	const addItemActive = () => {
		for (let i = 0; i < activeBlocks; i++){
			let randomResult = randomItemsField();
			if($gameFieldItems[randomResult].className === "active target"){
				randomResult = randomItemsField();
				$gameFieldItems[randomResult].className = "active target";
			} else {
				$gameFieldItems[randomResult].className = "active target";
			}
			
		}
		setTimeout( () => {
			$gameFieldItems.forEach(item => item.classList.remove("active"));
		}, timeActive);
		temporaryActiveItems = [...$gameFieldItems].filter(item => item.classList.contains('target'));	
	};

	const userWin = () => {
		setTimeout( () => {
			$gamePopup.style.opacity	= '1';
			$gamePopup.style.zIndex = '2';
		}, 300);
		document.querySelector('.game__frame-text').style.opacity = '0';
		document.querySelector('.game__play').style.opacity = '0';
		document.querySelector('.game__play-btn').style.opacity = '0';
	};

	const gameStart = () => {
		$gameLoose.style.opacity = '0';

		setTimeout( () => {
			$gameLoose.textContent = '';
		}, 300);
		switch(triesCount){
			case 2:
				timeActive = 2500;
				activeBlocks = 4;
				break;
			case 0:
				$gameLoose.textContent = 'На жаль, у Вас закінчились спроби';
				setTimeout( () => {
					$gameLoose.textContent = 'На жаль, у Вас закінчились спроби';
				}, 300);
				$gameLoose.style.opacity = '1';
				return;
		}
		$gameFieldItems.forEach(item => item.className = '');	
		triesCount--;
		clickCount = 5;
		userActiveBlocksCount = 0;
		$tries.textContent = triesCount;
		addItemActive();
	};

	const userSelect = e => { 
		const target = e.target;
		if(target && target.className === 'target'){
			target.classList.add('active');
			clickCount--;
			userActiveBlocksCount++;
			if(userActiveBlocksCount === temporaryActiveItems.length){ 
				userWin();
			}
		}	else if (target && target.tagName.toLowerCase() === 'span' && target.classList.contains('active') === false){
			clickCount--;
		}
		if(clickCount === 0 && userActiveBlocksCount !== activeBlocks) {
			$gameLoose.textContent = 'На жаль, Ви вказали не ті клітинки';
			$gameLoose.style.opacity = '1';
		} 

	};

	$gameBtn.addEventListener('click', gameStart);
	$gameField.addEventListener('click', e => {
		userSelect(e);
	});
});