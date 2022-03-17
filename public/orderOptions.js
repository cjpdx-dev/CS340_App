function onClickEditOrderItems(orderId, customerId) {
    window.location = 'OrderItems/CustomerID/' + encodeURI(customerId) + '/OrderID/' + encodeURI(orderId);
}

function onClickDeleteOrder(orderId) {
    $.ajax({
        url: '/Orders/DeleteOrder/' + orderId,
        type: 'delete',
        success: function(result){
            window.location.reload(true)
        }
    })
}