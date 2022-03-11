
function toggleNewAddressFields() {
    
    let newAddressFieldsContainer = document.getElementById('newAddressFieldsContainer')
    
    let checkboxNewAddressFields = document.getElementById('checkboxNewAddressFields');
    
    if (checkboxNewAddressFields.checked === true) {
        newAddressFieldsContainer.hidden = false;
    }
    else if (checkboxNewAddressFields.checked === false) {
        newAddressFieldsContainer.hidden = true;
    }
    else {
        console.log(checkboxNewAddressFields)
        console.log("unknown error")
    }
}