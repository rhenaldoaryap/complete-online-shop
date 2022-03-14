const cartItemUpdateFormElements = document.querySelectorAll(
  ".cart-item-management"
);
const cartTotalPriceElement = document.getElementById("cart-total-price");
const cartBadge = document.querySelector(".nav-items .badge");

async function updateCartItem(event) {
  event.preventDefault();

  const form = event.target;

  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        // make sure these key is match at the cart-controller
        // if you request to req.body.productid ("with lower i")
        // you have to use that key here also
        // check what key you use at cart-controller while we want to update the cart
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  const responseData = await response.json();

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    form.parentElement.parentElement.remove();
  } else {
    const cartItemTotalPriceElement =
      form.parentElement.querySelector(".cart-item-price");
    // updatedCartData.updatedItemPrice we get from cart-controller as a function and as a key inside of a literal object when we want to updatedCartData
    cartItemTotalPriceElement.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  // newTotalPrice we get form cart-controller when we want to updatedCartData
  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);

  // newTotalQuantity we get form cart-controller when we want to updatedCartData
  cartBadge.textContent = responseData.updatedCartData.newTotalQuantity;
}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener("submit", updateCartItem);
}

// for (const cartBadge of cartBadges) {
//   cartBadge.addEventListener("submit", updateCartItem);
// }
