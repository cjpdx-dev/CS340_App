function onClickRemoveOrderItem(orderLineId){
    console.log("orderLineId " + orderLineId)
    $.ajax({
        type: 'delete',
        url: "/OrderItems/OrderLineID/" + orderLineId,
        success: function(result){
            console.log("success")
            window.location.reload(true)
        },
        error: function(error){
            console.log(error)
        }

    });
}