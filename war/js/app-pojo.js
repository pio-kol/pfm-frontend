var Category = function() {
	this.id = "";
	this.name = "";
	this.parentCategory = null;
	this.visible = false;
	this.mode = 'readOnly';
};

Category.prototype.clear = function() {
	this.id = "";
	this.name = "";
	this.parentCategory = null;
	this.visible = false;
	this.mode = 'readOnly';
};

var Account = function() {
	this.id = "";
	this.name = "";
	this.value = "";
	this.visible = false;
	this.mode = 'readOnly';
};

Account.prototype.clear = function() {
	this.id = "";
	this.name = "";
	this.value = "";
	this.visible = false;
	this.mode = 'readOnly';
};

var Transaction = function() {
	this.id = "";
	this.date = "";
	this.description = "";
	this.comment = "";
	this.category = new Category();
	this.account = new Account();
	this.price = 0.00;
	this.visible = false;
	this.mode = 'readOnly';
};

Transaction.prototype.clear = function() {
	this.id = "";
	this.date = "";
	this.description = "";
	this.category = new Category();
	this.account = new Account();
	this.price = "";
	this.comment = "";
	this.visible = false;
	this.mode = 'readOnly';
};