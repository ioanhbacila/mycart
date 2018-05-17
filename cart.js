var shoppingCart = (function () {
    //private methods and properties
    var cart = [];

    function Item(name, price, count) {
        this.name = name
        this.price = price
        this.count = count
    };
    //save the cart info to localstorage
    function saveCart() {
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
    }
    //loads cart every time we open page
    function loadCart() {
        cart = JSON.parse(localStorage.getItem("shoppingCart"));
    }
    loadCart();

    //public methods and properties
    var obj = {};

    //add items to cart 
    obj.addItemToCart = function (name, price, count) {
        for (var i in cart) {
            if (cart[i].name === name) {
                cart[i].count += count;
                saveCart();
                return;
            }
        }
        var item = new Item(name, price, count);
        cart.push(item);
        saveCart();
    };

    //helps in setting count in given space after a particular item
    obj.setCountForItem = function (name, count) {
        for (var i in cart) {
            if (cart[i].name === name) {
                cart[i].count = count;
                break;
            }
        }
        saveCart();
    };

    //removes 1 count of a item
    obj.removeItemFromCart = function (name) {
        for (var i in cart) {
            if (cart[i].name === name) {
                cart[i].count--;
                if (cart[i].count === 0) {
                    cart.splice(i, 1);
                }
                break;
            }
        }
        saveCart();
    };

    //removes a particular type of item completely
    obj.removeItemFromCartAll = function (name) {
        for (var i in cart) {
            if (cart[i].name === name) {
                cart.splice(i, 1);
                break;
            }
        }
        saveCart();
    };
    //delete all item of cart
    obj.clearCart = function () {
        cart = [];
        saveCart();
    };

    //return total count
    obj.countCart = function () {
        var totalCount = 0;
        for (var i in cart) {
            totalCount += cart[i].count;
        }
        return totalCount;
    };

    //returns total cost
    obj.totalCart = function () {
        var totalCost = 0;
        for (var i in cart) {
            totalCost += cart[i].price * cart[i].count;
        }
        return totalCost.toFixed(2);
    };

    //list out all items of cart
    obj.listCart = function () {
        var cartCopy = [];
        for (var i in cart) {
            var item = cart[i];
            var itemCopy = {};
            for (var p in item) {
                itemCopy[p] = item[p];
            }
            itemCopy.total = (item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy);
        }
        return cartCopy;
    };
    //-----------------------------------------
    return obj;
})();

$(".add-to-cart").click(function (event) {
    event.preventDefault();
    var name = $(this).attr("data-name");
    var price = Number($(this).attr("data-price"));

    shoppingCart.addItemToCart(name, price, 1);
    displayCart();
});

$("#clear-cart").click(function (event) {
    shoppingCart.clearCart();
    displayCart();
});

//filling data in html li tags
function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for (var i in cartArray) {
        output += "<li>"
            + cartArray[i].name
            + " <input class='item-count' type='number' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
            + " x " + cartArray[i].price
            + " = " + cartArray[i].total
            + " <button class='plus-item' data-name='"
            + cartArray[i].name + "'>+</button>"
            + " <button class='subtract-item' data-name='"
            + cartArray[i].name + "'>-</button>"
            + " <button class='delete-item' data-name='" + cartArray[i].name + "'>X</button>"
            + "</li>";
    }
    $("#show-cart").html(output);
    $("#count-cart").html(shoppingCart.countCart());
    $("#total-cart").html(shoppingCart.totalCart());

}

$("#show-cart").on("click", ".delete-item", function (event) {
    var name = $(this).attr("data-name");
    shoppingCart.removeItemFromCartAll(name);
    displayCart();
});


$("#show-cart").on("click", ".subtract-item", function (event) {
    var name = $(this).attr("data-name");
    shoppingCart.removeItemFromCart(name);
    displayCart();

});

$("#show-cart").on("click", ".plus-item", function (event) {
    var name = $(this).attr("data-name");
    shoppingCart.addItemToCart(name, 0, 1);
    displayCart();

});

$("#show-cart").on("change", ".item-count", function (event) {
    var name = $(this).attr("data-name");
    var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
});



displayCart();