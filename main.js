// Nav effect 
const nav = document.querySelector("#nav");

// Product Container
const products = document.querySelector(".products-container");

// El contenedor de las categorías
const categories = document.querySelector(".categories");

// Un htmlCollection de botones de todas las categorías (mostrar el dataset)
const categoriesList = document.querySelectorAll(".category");

// Botón de ver más
const btnLoad = document.querySelector(".btn-load");

// Contenedor de productos del carrito
const productsCart = document.querySelector(".cart-container");

// Carrito
const cartMenu = document.querySelector(".cart");

// Boton del carrito
const cartBtn = document.querySelector(".cart-label");

// Botón para abrir y cerrar menú
const barsBtn = document.querySelector(".menu-label");

//  Menú (Hamburguesa)
const barsMenu = document.querySelector(".navbar-list");

// Modal de agregado al carrito
const succesModal = document.querySelector(".add-modal");

// Boton de delete del carrito.
const deleteBtn = document.querySelector(".btn-delete");

// Botón de comprar
const buyBtn = document.querySelector(".btn-buy");

//El total en precio del carrito
const total = document.querySelector(".total");

//  Modal de agregado al carrito.
const successModal = document.querySelector(".add-modal");


let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveLocalStorage = (cartList) => {
	localStorage.setItem("cart", JSON.stringify(cartList));
};

// Nav effect 

const onScroll = (event) => {
  const scrollPosition = event.target.scrollingElement.scrollTop;
  if (scrollPosition > 10) {
    if (!nav.classList.contains("scrolled-down")) {
      nav.classList.add("scrolled-down");
    }
  } else {
    if (nav.classList.contains("scrolled-down")) {
      nav.classList.remove("scrolled-down");
    }
  }
};

document.addEventListener("scroll", onScroll);

// Producst render

const splitProducts = (size) => {
	let dividedProducts = [];

	for (let i = 0; i < productsData.length; i += size) {
		dividedProducts.push(productsData.slice(i, i + size));
	}
	return dividedProducts;
};

const productsController = {
	dividedProducts: splitProducts(6),
	nextProductsIndex: 1,
	productsLimit: splitProducts(6).length,
};

const renderProduct = (product) => {
	const { id, nombre, precio, productImg} = product;
	return `
		<div class="product">
			<img src=${productImg} alt="${id}">
			<h3>${nombre}</h3>
			<p>${precio} USD</p>
			<button 
				class="btn-add"
				data-id="${id}"
                data-nombre="${nombre}"
                data-precio="${precio}"
            	data-imagen="${productImg}">Agregar al carrito</button>
		</div>
    `;
};

const renderDividedProducts = (index = 0) => {
	products.innerHTML += productsController.dividedProducts[index]
		.map(renderProduct)
		.join("");
};

const renderFilteredProducts = (category) => {
	const productsList = productsData.filter((product) => {
		return product.category === category;
	});
	products.innerHTML = productsList.map(renderProduct).join("");
};

const renderProducts = (index = 0, category = undefined) => {
	if (!category) {
		renderDividedProducts(index);
		return;
	}
	renderFilteredProducts(category);
};

const changeShowMoreBtnState = (category) => {
	if (!category) {
		btnLoad.classList.remove("hidden");
		return;
	}
	btnLoad.classList.add("hidden");
};

const changeBtnActiveState = (selectedCategory) => {
	const categories = [...categoriesList];
	categories.forEach((categoryBtn) => {
		if (categoryBtn.dataset.category !== selectedCategory) {
			categoryBtn.classList.remove("active");
			return;
		}
		categoryBtn.classList.add("active");
	});
};

const changeFilterState = (e) => {
	const selectedCategory = e.target.dataset.category;
	changeShowMoreBtnState(selectedCategory);
	changeBtnActiveState(selectedCategory);
};

const applyFilter = (e) => {
	if (!e.target.classList.contains("category")) {
		return;
	} else {
		changeFilterState(e);
	}
	if (!e.target.dataset.category) {
		products.innerHTML = "";
		renderProducts();
	} else {
		renderProducts(0, e.target.dataset.category);
		productsController.nextProductsIndex = 1;
	}
};

const isLastIndexOf = () => {
	return (
		productsController.nextProductsIndex === productsController.productsLimit
	);
};

const showMoreProducts = () => {
	renderProducts(productsController.nextProductsIndex);
	productsController.nextProductsIndex++;
	if (isLastIndexOf()) {
		btnLoad.classList.add("hidden");
	}
};

// Open Cart 

const toggleCart = () => {
	cartMenu.classList.toggle("open-cart");
	if (barsMenu.classList.contains("open-menu")) {
		barsMenu.classList.remove("open-menu");
		return;
	}
};

//Menu hamburguesa

const toggleMenu = () => {
	barsMenu.classList.toggle("open-menu");
	if (cartMenu.classList.contains("open-cart")) {
		cartMenu.classList.remove("open-cart");
		return;
	}
};

// Close when scroll

const closeOnScroll = () => {
	if (
		!barsMenu.classList.contains("open-menu") &&
		!cartMenu.classList.contains("open-cart")
	) {
		return;
	}
	barsMenu.classList.remove("open-menu");
	cartMenu.classList.remove("open-cart");
};

//Render cart product

const renderCardProduct = (cartProduct) => {
	const { id, nombre, precio, imagen, quantity} = cartProduct;
	return `
	<div class="cart-item">
		<div class="item">
			<img src= ${imagen} alt="producto del carrito">
			<div class="item-info">
				<h3>${nombre}</h3>
				<p>Precio: ${precio} USD</p>
			</div>
		</div>
		<div class="item-handler">
			<span class="quantity-handler down" data-id=${id}>-</span>
			<span class="item-quantity">${quantity}</span>
			<span class="quantity-handler up" data-id=${id}>+</span>
		</div>
	</div>
	`;
};

const renderCart = () => {
	if (!cart.length) {
		productsCart.innerHTML = `<p class="empty-msg">No hay productos en el carrito.</p>`;
		return;
	}
	productsCart.innerHTML = cart.map(renderCardProduct).join("");
};

const getCartTotal = () => {
	return cart.reduce((acc, cur) => {
		return acc + Number(cur.precio) * cur.quantity;
	}, 0);
}

const showTotal = () => {
	total.innerHTML = `${getCartTotal().toFixed(2)} USD`;
};

const disableBtn = (btn) => {
	if (!cart.length) {
		btn.classList.add("disabled");
	} else {
		btn.classList.remove("disabled");
	}
};

const checkCartState = () => {
	saveLocalStorage(cart);
	renderCart();
	showTotal();
	disableBtn(buyBtn);
	disableBtn(deleteBtn);
};

const addProduct = (e) => {
	if (!e.target.classList.contains("btn-add")) {
		return;
	}
	const { id, nombre, precio, imagen } = e.target.dataset;
	const product = productData(id, nombre, precio, imagen);

	if (isExistingCartProduct(product)) {
		addUnitToProduct(product);
		showSuccessModal("Se agregó una unidad del producto al carrito");
	} else {
		createCartProduct(product);
		showSuccessModal("El producto se ha agregado al carrito");
	}

	checkCartState();
};
	

const productData = (id, nombre, precio, imagen) => {
	return { id, nombre, precio, imagen};
};

const isExistingCartProduct = (product) => {
	return cart.find((item) => {
		return item.id === product.id;
	});
};

const addUnitToProduct = (product) => {
	cart = cart.map((cartProduct) => {
		return cartProduct.id === product.id
			? { ...cartProduct, quantity: cartProduct.quantity + 1 }
			: cartProduct;
	});
};

const showSuccessModal = (msg) => {
	successModal.classList.add("active-modal");
	successModal.textContent = msg;
	setTimeout(() => {
		successModal.classList.remove("active-modal");
	}, 1500);
};

const createCartProduct = (product) => {
	cart = [
		...cart,
		{
			...product,
			quantity: 1,
		},
	];
};

const handleMinusBtnEvent = (id) => {
	const existingCartProduct = cart.find((item) => {
		return item.id === id;
	});

	if (existingCartProduct.quantity === 1) {
		if (window.confirm("¿Desea eliminar el producto del carrito?")) {
			removeProductFromCart(existingCartProduct);
		}
		return;
	}

	substractProductUnit(existingCartProduct);
};

const handlePlusBtnEvent = (id) => {
	const existingCartProduct = cart.find((item) => {
		return item.id === id;
	});

	addUnitToProduct(existingCartProduct);
};

const removeProductFromCart = (existingProduct) => {
	cart = cart.filter((product) => product.id !== existingProduct.id);
	checkCartState();
};

const substractProductUnit = (existingProduct) => {
	cart = cart.map((product) => {
		return product.id === existingProduct.id
			? { ...product, quantity: Number(product.quantity) - 1 }
			: product;
	});
};

const handleQuantity = (e) => {
	if (e.target.classList.contains("down")) {
		handleMinusBtnEvent(e.target.dataset.id);
	} else if (e.target.classList.contains("up")) {
		handlePlusBtnEvent(e.target.dataset.id);
	}
	checkCartState();
};

const resetCartItems = () => {
	cart = [];
	checkCartState();
};

const completeCartAction = (confirmMsg, successMsg) => {
	if (!cart.length) return;
	if (window.confirm(confirmMsg)) {
		resetCartItems();
		alert(successMsg);
	}
};

const completeBuy = () => {
	completeCartAction("¿Desea completar su compra?", "¡Gracias por su compra!");
};

const deleteCart = () => {
	completeCartAction("¿Desea eliminar su carrito?", "Carrito eliminado");
};


// Init 

const init = () => {
	renderProducts();
	categories.addEventListener("click", applyFilter);
	btnLoad.addEventListener("click", showMoreProducts);
	cartBtn.addEventListener("click", toggleCart);
	barsBtn.addEventListener("click", toggleMenu);
	window.addEventListener("scroll", closeOnScroll);
	document.addEventListener("DOMContentLoaded", renderCart);
	document.addEventListener("DOMContentLoaded", showTotal);
	products.addEventListener("click", addProduct);
	productsCart.addEventListener("click", handleQuantity);
	buyBtn.addEventListener("click", completeBuy);
	deleteBtn.addEventListener("click", deleteCart);
	disableBtn(buyBtn);
	disableBtn(deleteBtn);
	
}


init()

