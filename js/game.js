const timerDisplay = document.getElementById('timer');
const container = document.querySelector('.container')
let bar = document.getElementById('bar');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const missedClicksDisplay = document.getElementById('missedclicks');
const pointToNextLevel = document.getElementById ('pointonextlevel');
const title = document.getElementById('title')
const highScoreContainer = document.getElementById('highScore')

let score = 0;
let level = 1;
let rotating = false;
let timeLeft = 60;
let timerIntervalId;
let titleOriginalContent= title.textContent;
let point = 10;
let missedclicks = 0;
let speedRotation = 2000;
let baseSpeedOnHoverBar = 300;

let barAnimate;

const username = window.prompt('Name: ');

 function PlayMusic() {
	let audio = document.getElementById('backgroundMusic');
	audio.play();
  };

let highScore = [];

if (localStorage.getItem('highScore') !== null) {
	highScore = JSON.parse(localStorage.getItem('highScore'));
	createHighScoreHtml(highScore);
}

function createHighScoreHtml(highScoreParams) {
	for (let i=0; i < highScoreParams.length; i++) {
		if (i <= 5) {
			let divName = document.createElement('div');
			let divDate = document.createElement('div');
			let divScore = document.createElement('div');

			divName.innerHTML = highScoreParams[i].name;
			divDate.innerHTML = highScoreParams[i].date;
			divScore.innerHTML = highScoreParams[i].amount;

			highScoreContainer.append(divName, divDate, divScore)
		} else {
			break;
		}
	}
}

container.addEventListener('click', function(event) {
	//verifie si l'element clicke est la barre en comparant son id
	if (rotating) {
		if (event.target.id === 'bar') {
			// calcul le nb de point a aj en fonction du niveau et raj les au score
			let pointsToAdd = 10 * level;
			score += pointsToAdd;
			// decremente le nb de point restant et met a j l'affichage
			point-- ;
			pointToNextLevel.textContent = point;
			//si le nb de clicks restant est devenu  a 0 appel la fonction avance au prochain niveau
			if (point === 0) {
				advanceToNextLevel();
			}
			// si l'element clique n'est pas la barre , diminue le score en fonction du niveau actuel
		} else {
			score -= level;
			missedclicks++  ;

		}
		// et a met a j láffichage du score
		scoreDisplay.textContent = score;
		missedClicksDisplay.textContent = missedclicks;
	}
});

title.addEventListener('mouseover', function (even) {
	title.textContent = 'Click to start';
})

title.addEventListener('mouseout', function (even) {
	title.textContent = titleOriginalContent
})


title.addEventListener('click', function (event) {
	if (confirm('Do you want to start the game ?')) {
		startGame();
		PlayMusic();

	} else {
		alert('No')
	}
})

bar.addEventListener('mouseover', () => {
	setTimeout(()=> {
		if (rotating) {
			moveBar();
		}
	}, baseSpeedOnHoverBar);
});


function rotateBar() {
	bar.style.transform = 'rotate(0deg)';// Réinitialise la rotation de la barre à 0 degrés

	barAnimate = bar.animate(
		[{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
		{
			duration: speedRotation,// nb de fois que l'animation doit se repeter 
			iterations: Infinity,
		}//  cette fonction prend un élément bar et fait une animation de
		// rotation en utilisant bar.animate(). L'animation fait passer la propriété transform de l'élément HTML de rotate(0deg) à rotate(360deg)
	);
}

function moveBar() {
	const containerWidth = container.clientWidth;
	const containerHeight = container.clientHeight;
	const barWidth = bar.offsetWidth;
	const barHeight = bar.offsetHeight;

	const randomX = Math.floor(Math.random() * (containerWidth - barWidth));
	const randomY = Math.floor(Math.random() * (containerHeight - barHeight));

	bar.style.top = randomY + 'px';
	bar.style.left = randomX + 'px';
}

function startGame(){
	rotating = true ;
	rotateBar();
	startTimer();
}

function startTimer() {
	// definit un intervalle qui se repete tt les sec 
	timerIntervalId = setInterval(function() {
		//diminue la var timeLeft de 1 
		timeLeft--;
		// met a jour láffichage du minuteur avec la nvl val de timeleft
		timerDisplay.innerHTML = timeLeft + "s";
		// si le temps restant est ecoule , arreter le minuteur et appl stopGame()
		if (timeLeft <= 0) {
			clearInterval(timerIntervalId);
			stopGame();
		}
	}, 1000);
}

function advanceToNextLevel() {
	level++
	speedRotation -= 250;
	baseSpeedOnHoverBar -= 50;
	point +=10;
	timeLeft = timeLeft + 10;
	levelDisplay.innerHTML = `${level}`;

}

function recordHighsScore(highScore) {
	highScore.push({
		name: username,
		date: (new Date()).toDateString(),
		amount: score
	})
	highScore.sort((p1, p2) => (p1.amount < p2.amount) ? 1 : (p1.amount > p2.amount) ? -1 : 0)
	highScore = highScore.filter(item => item !== null);
	createHighScoreHtml(highScore);
	localStorage.setItem('highScore', JSON.stringify(highScore));
}

function stopGame() {
	if (highScore.length > 0) {
		if (highScore.length >= 5) {
			let minScore = highScore.reduce((min, obj) => obj.amount < min ? obj.amount : min, highScore[0].amount)
			if (score > minScore) {
				let minScoreIndex = highScore.findIndex((obj) => obj.amount === minScore);
				delete highScore[minScoreIndex];
				recordHighsScore(highScore);
			}
		} else {
			recordHighsScore(highScore);
		}
	} else {
		recordHighsScore(highScore);
	}

	alert( "GAME OVER, your score was : " + score )

	if (barAnimate !== undefined) {
		barAnimate.cancel();
	}

	rotating = false;
	score = 0;
	scoreDisplay.textContent = score;
	level = 1;
	levelDisplay.innerHTML = `${level}`;
	timeLeft = 60;
	timerDisplay.innerHTML = timeLeft + "s";
	point = 10;
	missedclicks = 0;
	missedClicksDisplay.textContent = missedclicks;

}