var Transaction = function() {
	this.id = "";
	this.date = "";
	this.description = "";
	this.comment = "";
	this.categoryName = "";
	this.categoryId = "";
	this.accountId = "";
	this.accountName = "";
	this.price = 0.00;
	this.visible = false;
	this.mode = 'readOnly';
};

Transaction.prototype.clear = function() {
	this.id = "";
	this.date = "";
	this.description = "";
	this.categoryName = "";
	this.categoryId = "";
	this.accountId = "";
	this.accountName = "";
	this.price = "";
	this.comment = "";
	this.visible = false;
	this.mode = 'readOnly';
};

var Category = function() {
	this.name = "";
	this.parentCategoryId = null;
	this.parentCategoryName = null;
	this.visible = false;
	this.mode = 'readOnly';
};

Category.prototype.clear = function() {
	this.name = "";
	this.parentCategoryId = null;
	this.parentCategoryName = null;
	this.visible = false;
	this.mode = 'readOnly';
};

var Account = function() {
	this.name = "";
	this.value = "";
	this.visible = false;
	this.mode = 'readOnly';
};

Account.prototype.clear = function() {
	this.name = "";
	this.value = "";
	this.visible = false;
	this.mode = 'readOnly';
};