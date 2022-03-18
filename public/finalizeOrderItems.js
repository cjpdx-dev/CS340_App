function onClickSubmitOrder() {
    orderId = document.getElementById('orderItemsOrderId').value;

    paymentSelections = document.getElementById('orderItemsPaymentSelector')
    paymentId = paymentSelections.options[paymentSelections.selectedIndex].value;
    
    $.ajax({
        url: '/Transactions/CreateTransaction/' + orderId + "/PaymentID/" + paymentId,
        type: 'post',
        success: function(result){
            console.log(result)
            if(result){
                parsedResult = JSON.parse(result)
                url = '/Transactions/PayID/' + parsedResult["paymentId"];
                console.log(url)
                window.location.replace(url);
            }
        }
    })
}