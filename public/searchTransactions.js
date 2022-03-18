function onClickSearchByPayID() {
    let payMethodID = document.getElementById('transactionPaymentID').value
    window.location = '/Transactions/PayID/' + encodeURI(payMethodID)
}
