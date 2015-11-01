var Editable = function() {
	this.copyForEdit = null;
	this.visible = false;
	this.mode = 'readOnly';
}

Category.prototype = new Editable(); 
Category.prototype.constructor=Category;       
function Category(){ 
	this.id = "";
	this.name = "";
	this.parentCategory = null;
}

Account.prototype = new Editable(); 
Account.prototype.constructor=Account;       
function Account() {
	this.id = "";
	this.name = "";
	this.value = 0.00;
};

Transaction.prototype = new Editable(); 
Transaction.prototype.constructor=Transaction;       
function Transaction() {
	this.id = "";
	this.date = "";
	this.description = "";
	this.comment = "";
	this.category = new Category();
	this.account = new Account();
	this.price = 0.00;
};
