function searchAddressByID() {
    let address_id = document.getElementById('searchAddressID').value
    window.location = '/Addresses/searchAddressID/' + encodeURI(address_id)
}
