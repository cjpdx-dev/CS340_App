

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

function validateCustomerID() {

    let customerID = document.getElementById('inputCustomerID').value
    document.getElementById('customerID').value = customerID

    let addressSelections = document.getElementById('selectAddress')
    addressSelections.options.length = 0;

    $.ajax({
        url: '/PayMethods/GetCustomerAddresses/' + customerID,
        type: 'GET',
        success: function(result) {
            if(result) {
                alert(JSON.stringify(result))

                let defaultOption = document.createElement('option');
                defaultOption.value = "default";
                defaultOption.innerHTML = "Saved Addresses";
                addressSelections.appendChild(defaultOption);

                sessionStorage.setItem('customerAddresses', JSON.stringify(result))
                addressCount = Object.keys(result).length;

                for (let i = 0; i<addressCount; i++){
                    let newOption = document.createElement('option');
                    let address = result[i];
                    newOption.value = address.address_id;
                    
                    let addressString = "";
                    for (let key in address){
                        if (key !== "id" && key !== "address_id"){
                            addressString = addressString + address[key] + " ";
                        }
                    }
                    newOption.innerHTML = addressString;
                    addressSelections.appendChild(newOption);
                }
            } else {
                alert("Invalid Customer ID")
                window.location.reload(true);
            }
        }
    })
};

function onAddressSelectionChange() {
    let storedAddresses = JSON.parse(sessionStorage.getItem('customerAddresses'))
    let addressSelections = document.getElementById('selectAddress')
    selectedID = addressSelections.options[addressSelections.selectedIndex].value
    
    document.getElementById('addressID').value = selectedID
};


