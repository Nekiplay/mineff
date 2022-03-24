(function() {
	
	let io = window.io
	let socket = io.connect()
	let drawInterval = setInterval(draw, 1)
	
	
	// Переменные полученные сокетом
	let nickname = "";
	
	let health = 0;
	let food = 0;
	
	let money = 0;
	
	let level = 0;
	let points = 0;
	let progress = 0.0;
	
	let bottlexp = 0;
	
	let attacks = 0;
	
	// Сокеты
	socket.on("nickname", function(newHealth) {
		nickname = newHealth;
	});
	
	socket.on("attacks", function(newHealth) {
		attacks = newHealth;
	});
	
	socket.on("health", function(newHealth) {
		health = newHealth;
	});
	
	socket.on("food", function(newFood) {
		food = newFood;
	});
	
	socket.on("level", function(Level) {
		level = Level;
	});
	socket.on("points", function(Level) {
		points = Level;
	});
	socket.on("progress", function(Level) {
		progress = Level;
	});
	
	socket.on("money", function(newMoney) {
		money = newMoney;
	});
	
	socket.on("bottlexp", function(newMoney) {
		bottlexp = newMoney;
	});
	
	let white = "#ffffff"
    , black = "#000000"
    , imgArrow = new Image()
    , imgBlueArrow = new Image()
    , imgRedArrow = new Image()
    , w = canvas.width
    , h = canvas.height
    , centerX = w / 2
    , centerY = h / 2
    , xFromMc = w / 100
    , yFromMc = h / 100
	
	createLabel("empty", "", true);
	createLabel("empty", "<b>Main information</b>", true);
	createLabel("nickname", "Nickname: null", true);
	createLabel("health", "Health: null", true);
	createLabel("food", "Food: null", true);
	createLabel("money", "Money: null", true);
	createLabel("attacks", "Attacks: null", true);
	createLabel("empty", "", true);
	createLabel("empty", "<b>Experience information</b>", true);
	createLabel("level", "LvL: null", true);
	createLabel("level_point", "XP: null", true);
	createLabel("bottle", "Bottle o' Enchanting: null", true);
	createLabel("empty", "", true);
	createLabel("empty", "<b>Actions</b>", true);
	createTextBox("nickname", "Ваш ник");
	createButton("withdraw money", "Снять деньги", true, function(){
		socket.emit("message", "/pay " + document.getElementById("nickname").value + " " + money);
		alert("Баланс переведен игроку: " + document.getElementById("nickname").value)
		return true;
	});
	
	createTextBox("text", "Текст");
	createButton("textsend", "Отправить сообщение", true, function(){
		socket.emit("message", document.getElementById("text").value);
		return true;
	});
	
	function draw() {
		let nicknameL = document.getElementById("nickname")
		nicknameL.innerHTML = "Ник: " + nickname;
		
		let HealthL= document.getElementById("health")
		HealthL.innerHTML = "Здоровье: " + health;
		
		let FoodL= document.getElementById("food")
		FoodL.innerHTML = "Еда: " + food;
		
		let MoneyL= document.getElementById("money")
		MoneyL.innerHTML = "Баланс: " + money + "$";
		
		let AttacksL= document.getElementById("attacks")
		AttacksL.innerHTML = "Сделано ударов: " + attacks;
		
		let LevelL= document.getElementById("level")
		let progress2 = Math.round(progress, -1);   // 55.6
		progress2 = Math.round(progress * 1000) / 1000
		LevelL.innerHTML = "Уровень: " + level + " (" + progress2 + "%)";
		
		let LevelPointL= document.getElementById("level_point")
		LevelPointL.innerHTML = "Опыт: " + points;
		
		let bottle = document.getElementById("bottle")
		bottle.innerHTML = "Bottle o' Enchanting: " + bottlexp;

	}
	function createTextBox(id, text, newline)
	{
		let br = document.createElement("br");
		let lb = document.createElement("input");
		lb.style["padding"] = "0px";
		lb.setAttribute("id", id);
		lb.innerHTML = text;
		document.body.appendChild(lb);
		if (newline == true)
		{
			document.body.appendChild(br);
		}
		lb.setAttribute("placeholder", text);
	}
	function createButton(id, text, newline, click)
	{
		let br = document.createElement("br");
		let lb = document.createElement("button");
		lb.style["padding"] = "0px";
		lb.setAttribute("id", id);
		lb.innerHTML = text;
		document.body.appendChild(lb);
		if (newline == true)
		{
			document.body.appendChild(br);
		}
		lb.onclick = click;
	}
	function createLabel(id, text, newline)
	{
		let br = document.createElement("br");
		let lb = document.createElement("Label");
		lb.style["padding"] = "0px";
		lb.setAttribute("id", id);
		lb.innerHTML = text;
		document.body.appendChild(lb);
		if (newline == true)
		{
			document.body.appendChild(br);
		}
	}
}());