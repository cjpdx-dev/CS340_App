

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
};

function onCustomerIdBlur() {
    let customerID = document.getElementById('inputCustomerID').value;
    window.location = '/PayMethods/' + encodeURI(customerID);
}


function onAddressSelectionChange() {
    let storedAddresses = JSON.parse(sessionStorage.getItem('customerAddresses'))
    let addressSelections = document.getElementById('selectAddress')
    selectedID = addressSelections.options[addressSelections.selectedIndex].value
    
    document.getElementById('addressID').value = selectedID
};


