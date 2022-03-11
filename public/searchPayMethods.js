function searchPayMethodByID() {
    let payMethodID = document.getElementById('searchPayMethodID').value
    window.location = '/PayMethods/SearchPayMethodID/' + encodeURI(payMethodID)
}

function searchPayMethodsByCustomerID() {
    let customerID = document.getElementById('searchCustomerID').value
    window.location = '/PayMethods/SearchCustomerID/' + encodeURI(customerID) 
}