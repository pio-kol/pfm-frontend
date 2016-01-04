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
	this.id = "";
	this.name = "";
	this.description = "";
	this.comment = "";
	this.dateRange = {startDate: moment().startOf('month'), endDate: moment().endOf('month')};
	this.priceFrom = null;
	this.priceTo = null;
	this.accounts = [];
	this.categories = [];
	this.active = false;
}

function createNewTransaction(data){
	var newTransaction = new Transaction();
	newTransaction.id = data.id;
	newTransaction.date = new Date(data.date);
	newTransaction.description = data.description;
	newTransaction.comment = data.comment;
	newTransaction.category.id = "" + data.categoryId; 
	newTransaction.category.name = "";
	newTransaction.account.id = "" + data.accountId; 
	newTransaction.account.name = "";
	newTransaction.price = parseFloat(data.price);
	
	return newTransaction;
}

var datePickerRanges = {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'This Week': [moment().startOf('week'), moment().endOf('week')],
        'Last Week': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'This Year': [moment().startOf('year'), moment().endOf('year')],
        'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
  }

