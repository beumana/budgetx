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

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        }
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
                value: document.querySelector(DOMstrings.inputValue).value
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


    var ctrlAddItem = function () {
        var input, newItem;

        // 1. get field input data
        input = uiCtrl.getInput();

        // 2. add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value)

        // 3. add item to UI
        uiCtrl.addListItem(newItem, input.type);

        // 4. calculate budget
        // 5. display budget on UI
    }

    return {
        init: function(){
            setupEventListeners();
        }
    }

})(budgetController, uiController);

appController.init();