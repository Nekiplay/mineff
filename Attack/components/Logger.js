
var fs = require("fs");
var currentdate = new Date(); 

class logger
{
	writeLog(logtext)
	{
		fs.appendFile("logs/" + "[" + currentdate.toLocaleDateString() + "] " + "log.txt", "[" + new Date().toLocaleTimeString() + "] " + logtext, function (err)
		{
	
		});
	}
}

module.exports = logger;