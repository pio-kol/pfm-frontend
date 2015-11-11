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
	this.dateFrom = new Date();
	this.dateFrom.setMonth(this.dateFrom.getMonth()-1);
	this.dateFrom.setDate(1);
	this.dateTo = null;
	this.description = "";
	this.comment = "";
	this.priceFrom = null;
	this.priceTo = null;
}

function convertDateToString(date){
	var dd = date.getDate();
	var mm = date.getMonth()+1; //January is 0!
	var yyyy = date.getFullYear();
	if(dd<10){dd='0'+dd};
	if(mm<10){mm='0'+mm};
	return "" + yyyy + "-" + mm + "-" + dd;
}
