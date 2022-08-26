const { loadProducts,storeProducts } = require("../data/productsModule");

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {

	// Root - Show all products
	index: (req, res) => {
		
		const inSale = products.filter (product => product.category === "in-sale");
		const visited = products.filter (product => product.category === "visited");

		return res.render ("index", {
			inSale,
			visited,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {

		const products = loadProducts();
		const product = products.find(product => product.id === +req.params.id);
		return res.render("detail", {
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {

		return res.render("product-create-form")
	},

	// Create -  Method to store
	store: (req, res) => {

		const products = loadProducts();
		const{ name, price, discount, description, category} = req.body;

        const newProduct = {
			id : (products[ products.length - 1 ].id + 1),
			name : name.trim(),
			description : description.trim(),
			price : +price,
			discount : +discount,
			image : "default-image.png",
			category
		}

		const productsModify = [...products, newProduct];
		storeProducts(productsModify);
		return res.redirect("/")
	},

	// Update - Form to edit
	edit: (req, res) => {

		const products = loadProducts();
		const product = products.find(product => product.id === +req.params.id);
		return res.render("product-edit-form", {
			product,
		})
	},

	// Update - Method to update
	update: (req, res) => {

		const products = loadProducts();
		const {name, price, discount, category, description} = req.body;
		const productModify = products.map(product => {
			if (product.id === +req.params.id) {
				return {
					...product,
					name: name.trim(),
					price: +price,
					discount: +discount,
					description: description.trim(),
					category
				}
			}
			return product
		})
		storeProducts(productModify)
		return res.redirect("/")
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {

		const {id} = req.params;
		const products = loadProducts();
		const productsModify = products.filter( product => product.id !== +id);
		
		storeProducts(productsModify);
		return res.redirect("/")
	}
};

module.exports = controller;