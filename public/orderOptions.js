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

function onChangeOrderStatus(orderId) {

    $.ajax({
        url: '/Orders/UpdateStatus/' + $("#selectStatus").val() + '/OrderID/' + orderId,
        type: 'put',
        success: function(result){
            window.location.reload(true)
        }
    })
}