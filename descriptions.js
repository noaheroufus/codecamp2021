function Description() {
		this.WEAKWIFI = 0;
		this.BLACKHATHACKER = 1;
		this.NOPOWER = 2;

		this.titles = [];
		this.titles.push("Weak WiFi");
		this.titles.push("Black Hat Hacker");
		this.titles.push("No Power");
		this.titles.push("Wireless Interference");

		this.descriptions = [];
		this.descriptions.push("WiFi signal strength is low. Devices");
		this.descriptions.push("TODO");
		this.descriptions.push("TODO");
		this.descriptions.push("TODO");
}

Description.prototype.getTitle = function(index) {
		return this.titles[index];
}
Description.prototype.getDescription = function(index) {
		return this.descriptions[index];
}
