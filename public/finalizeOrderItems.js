function onClickSubmitOrder() {
    orderId = document.getElementById('orderItemsOrderId').value;

    paymentSelections = document.getElementById('orderItemsPaymentSelector')
    paymentId = paymentSelections.options[paymentSelections.selectedIndex].value;
    
    $.ajax({
        url: '/Transactions/CreateTransaction/' + orderId + "/PaymentID/" + paymentId,
        type: 'post',
        success: function(result){
            window.location.reload(true)
        }
    })
}