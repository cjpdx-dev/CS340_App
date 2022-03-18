function onClickShowCustomerAddresses(customerId) {
    window.location = '/CustomerAddresses/' + encodeURI(customerId);
}

function onClickShowCustomerPayMethods(customerId) {
    window.location = '/CustomerPayMethods/' + encodeURI(customerId);
}
