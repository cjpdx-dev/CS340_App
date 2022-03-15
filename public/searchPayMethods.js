function searchPayMethodByID() {
    let payMethodID = document.getElementById('searchPayMethodID').value
    window.location = '/PayMethods/SearchByPayMethodID/' + encodeURI(payMethodID)
}

function searchPayMethodsByCustomerID() {
    let customerID = document.getElementById('searchCustomerID').value
    window.location = '/PayMethods/SearchByCustomerID/' + encodeURI(customerID) 
}