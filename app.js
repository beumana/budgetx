var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;
            
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id +1;
            } else {
                ID = 0;
            }
            

            // Create new item based on 'income' or 'expense' type
            if (type === "expense") {
                newItem = new Expense(ID, des, val);
            } else if (type === "income") {
                newItem = new Income(ID, des, val);
            }

            // Push it to data structures
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        calculateBudget: function() {
            // calculate total income and expense
            calculateTotal('expense');
            calculateTotal('income');

            // calculate the budget: income - expense
            data.budget = data.totals.income - data.totals.expense;
            
            // calculate the % of income that we spent
            if (data.budget > 0) {  // ALT: (data.totals.income > 0)
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.income,
                totalExp: data.totals.expense,
                percentage: data.percentage
            };
        },

        testing: function(){
            console.log(data)
        }

    };

})();



var uiController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'income') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'expense') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            // Trick to convert a list into an array
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };
        

})();



var appController = (function(budgetCtrl, uiCtrl){

    var setupEventListeners = function() {
        
        var DOM = uiCtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event){
            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });   
        
    }

    var updateBudget = function() {
        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3. display the budget on the UI
        console.log(budget);
    }


    var ctrlAddItem = function () {
        var input, newItem;

        // 1. get field input data
        input = uiCtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) { // check empty fields
            // 2. add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            // 3. add item to UI
            uiCtrl.addListItem(newItem, input.type);

            // 4. clear fields
            uiCtrl.clearFields();

            // 5. calculate and update value
            updateBudget();
        }
    }

    return {
        init: function(){
            setupEventListeners();
        }
    }

})(budgetController, uiController);

appController.init();