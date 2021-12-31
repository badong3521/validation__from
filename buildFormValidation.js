

// Đối tượng `Validator`
function Validator(options) {
    //Hàm xử lý khi form validate có con ông cháu cha bên ngoài sex choc vào đúng thằng bên ngoài cùng p3
    function getParent(element, selector){
        while (element.parentElement) {
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }
    var selectorRules = {}

    //Hàm thực hiện Validate
    function validate(inputElement,rule){
        var errorMessage = rule.test(inputElement.value)
        console.log(errorMessage)
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
            if(errorMessage) {
                errorElement.innerText = errorMessage
                inputElement.parentElement.classList.add('invalid')
            }else{
                errorElement.innerText = ''
                inputElement.parentElement.classList.remove('invalid')
            }      
            return !errorMessage
    }
    var formElement = document.querySelector(options.form)
    if(formElement) {
        // khi submit form element
        formElement.onsubmit = function(e) {{
            e.preventDefault()



            var isFormValid = true;

            //Lặp qua mỗi rule va validate hay chưa
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement,rule)
                if(!isValid) {
                    isFormValid = false
                }
            }) 
            
            
            if(isFormValid) {
                if(typeof options.onSubmit === 'function') {

                    var enableInputs = formElement.querySelectorAll('[name]')
                    //enableInputs đang là một nodelist nên convert sang array
                    var formValues = Array.from(enableInputs).reduce(function(values,input){
                        (values[input.name] = input.value)
                        return values
                    }, {})
                    options.onSubmit(formValues)
                }
            }
        }}


        //Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
        options.rules.forEach(function(rule) {

            //Lưu lại các rules cho mỗi input
            //Xử dụng dấu [] để tạo key cho oject selectorRules
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }
             
            var inputElement = formElement.querySelector(rule.selector)

            if (inputElement) {
                //Xử lý  trường hợp blur ra input
                inputElement.onblur = function () {
                    validate(inputElement,rule);
                }

                // Xử lý mỗi khi người dùng nhập input, sẽ off lỗi 
                inputElement.oninput = function(){
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })

    }
}



//Định nghĩa rules
//Nguyên tắc của các rules:
//1 Khi có lỗi => trả ra message lỗi
//2 Khi không hợp lệ => undefined
Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập email'
        }
    }
}

Validator.minLength = function(selector,min, message){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message){
    return {
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message || `Giá trị nhập vào chưa chính xác`
        }
    }
}