function searchCustomerByID() {
    let customer_id = document.getElementById('search_customer_id').value
    window.location = '/Customers/searchId/' + encodeURI(customer_id)
}