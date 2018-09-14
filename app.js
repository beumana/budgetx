var budgetController = (function(){
    
    // some code

})();

var uiController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
        

})();

var appController = (function(budgetCtrl, uiCtrl){

    var DOM = uiCtrl.getDOMstrings();

    var ctrlAddItem = function () {

        console.log(uiCtrl.getInput());
        // 1. get field input data
        // 2. add item to budget controller
        // 3. add item to UI
        // 4. calculate budget
        // 5. display budget on UI
    }

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if (event.keycode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, uiController);