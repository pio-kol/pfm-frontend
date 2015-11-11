var Editable = function() {
	this.copyForEdit = null;
	this.visible = false;
	this.mode = 'readOnly';
}

Editable.prototype.editMode = function(){
	this.copyForEdit = JSON.parse(JSON.stringify(this)); 
	this.mode = "edit";
}

Editable.prototype.readOnlyMode = function(){
	this.mode = "readOnly";
	this.copyForEdit = null; 
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
	this.date = new Date();
	this.description = "";
	this.comment = "";
	this.category = new Category();
	this.account = new Account();
	this.price = 0.00;
};

var TransactionsFilter = function() {
	this.dateRange = {startDate: moment().startOf('month'), endDate: moment().endOf('month')};
	this.description = "";
	this.comment = "";
	this.priceRange = {description : "All", priceFrom : null, priceTo : null};
	this.priceTo = null;
}

