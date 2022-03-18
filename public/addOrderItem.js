function onClickAddToOrder() {
    let productSelections = document.getElementById('selectProduct')
    let selectedProductId = productSelections.options[productSelections.selectedIndex].value;
    let orderId = document.getElementById('orderItemsOrderId').value;

    $.ajax({
        url: '/OrderItems/OrderID/' + orderId + '/AddProduct/' + selectedProductId,
        type: 'post',
        success: function(result){
            window.location.reload(true)
        }
    }); 
}