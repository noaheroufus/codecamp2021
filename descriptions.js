function Description() {
		this.WEAKWIFI = 0;
		this.BLACKHATHACKER = 1;
		this.NOPOWER = 2;
		this.WIRELESSINTERFERENCE= 3;

		this.titles = [];
		this.titles.push("Weak WiFi");
		this.titles.push("Black Hat Hacker");
		this.titles.push("No Power");
		this.titles.push("Wireless Interference");

		this.descriptions = [];
		this.descriptions.push("WiFi signal strength is low. Devices.");
		this.descriptions.push("A bad guy who wants your data.");
		this.descriptions.push("None of the lights are on.");
		this.descriptions.push("There are a lot of other networks around.");

		this.WIFIEXTENDER = 0;
		this.CHANGEPASSWORD = 1;
		this.POWERCABLE = 2;
		this.CHANGECHANNEL = 3;

		this.itemTitles = [];
		this.itemTitles.push("WiFi Extender");
		this.itemTitles.push("Change Password");
		this.itemTitles.push("Power Cable");
		this.itemTitles.push("Change Router Channel");

		this.itemDescriptions = [];
		this.itemDescriptions.push("Relays a wireless signal to extend its range.");
		this.itemDescriptions.push("Create a new password to increase security.");
		this.itemDescriptions.push("Unplug the device for a while, then plug it back in.");
		this.itemDescriptions.push("Enter router's configuration options and change which part of the frequency band it's using.");
}

Description.prototype.getTitle = function(index) {
		return this.titles[index];
}
Description.prototype.getDescription = function(index) {
		return this.descriptions[index];
}
Description.prototype.getItemTitle = function(index) {
		if (index == ITEM_EXTENDER) {
				return this.itemTitles[this.WIFIEXTENDER];
		} else if (index == ITEM_PASSCHANGE) {
				return this.itemTitles[this.CHANGEPASSWORD];
		} else if (index == ITEM_POWER) {
				return this.itemTitles[this.POWERCABLE];
		} else if (index == ITEM_CHANCHANGE) {
				return this.itemTitles[this.CHANGECHANNEL];
		}
}
Description.prototype.getItemDescription = function(index) {
		if (index == ITEM_EXTENDER) {
				return this.itemDescriptions[this.WIFIEXTENDER];
		} else if (index == ITEM_PASSCHANGE) {
				return this.itemDescriptions[this.CHANGEPASSWORD];
		} else if (index == ITEM_POWER) {
				return this.itemDescriptions[this.POWERCABLE];
		} else if (index == ITEM_CHANCHANGE) {
				return this.itemDescriptions[this.CHANGECHANNEL];
		}
}
