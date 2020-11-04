

module.exports = () => {
	var red = Math.floor(Math.random()*256),
	green = Math.floor(Math.random()*256),
	blue = Math.floor(Math.random()*256);
	while(red < 100 || green < 100 || blue < 100) {
		if (red < 100) {
			red += Math.floor(Math.random()*100);
		}
		if (green < 100) {
			green += Math.floor(Math.random()*100);
		}
		if (blue < 100) {
			blue += Math.floor(Math.random()*100);
		}
	}
	red = red.toString(16);
	green = green.toString(16);
	blue = blue.toString(16);
	return "#"+red+green+blue;
}