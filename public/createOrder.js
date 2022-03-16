function createOrderByCustomerID() {
    customerID = document.getElementById("newOrderCustomerID").value
    window.location = '/Orders/' + encodeURI(customerID);
}