"use strict";
// ---------- Крок 1. Типи товарів ----------
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotal = exports.addToCart = exports.filterByPrice = exports.findProduct = void 0;
// ---------- Крок 2. Пошук та фільтрація ----------
const findProduct = (products, id) => {
    if (!Array.isArray(products) || products.length === 0) {
        return undefined;
    }
    if (!Number.isFinite(id)) {
        return undefined;
    }
    for (const item of products) {
        if (item.id === id) {
            return item;
        }
    }
    return undefined;
};
exports.findProduct = findProduct;
const filterByPrice = (products, maxPrice) => {
    if (!Array.isArray(products) || !Number.isFinite(maxPrice)) {
        return [];
    }
    if (maxPrice < 0) {
        return [];
    }
    const result = [];
    for (const item of products) {
        if (item.price <= maxPrice) {
            result.push(item);
        }
    }
    return result;
};
exports.filterByPrice = filterByPrice;
// ---------- Крок 3. Робота з кошиком ----------
const addToCart = (cart, product, quantity) => {
    if (!product || quantity <= 0) {
        console.warn("Неправильні дані для додавання в кошик.");
        return cart;
    }
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    // робимо копію, щоб не мутувати оригінальний масив
    const updated = cart.slice();
    if (existingIndex >= 0) {
        const current = updated[existingIndex];
        updated[existingIndex] = Object.assign(Object.assign({}, current), { quantity: current.quantity + quantity });
    }
    else {
        updated.push({ product, quantity });
    }
    return updated;
};
exports.addToCart = addToCart;
const calculateTotal = (cart) => {
    if (!Array.isArray(cart)) {
        return 0;
    }
    let total = 0;
    for (const item of cart) {
        if (item.quantity > 0 &&
            item.product.price >= 0 &&
            item.product.inStock) {
            total += item.product.price * item.quantity;
        }
    }
    return total;
};
exports.calculateTotal = calculateTotal;
// ---------- Крок 4. Тестові дані та приклад використання ----------
const electronicsData = [
    {
        id: 101,
        name: "Ноутбук Pro 14",
        price: 42000,
        inStock: true,
        description: "Компактний ноутбук для розробки",
        category: "electronics",
        brand: "CodeTech",
        model: "CT-14P",
        voltage: 220
    },
    {
        id: 102,
        name: "Монітор 27\"",
        price: 11500,
        inStock: true,
        description: "Монітор з IPS матрицею",
        category: "electronics",
        brand: "ViewMax",
        model: "VM-27U",
        voltage: 220
    }
];
const clothingData = [
    {
        id: 201,
        name: "Худі оверсайз",
        price: 1800,
        inStock: true,
        description: "Тепле худі для осені",
        category: "clothing",
        size: "M",
        color: "black",
        forSeason: "all"
    },
    {
        id: 202,
        name: "Шорти спортивні",
        price: 900,
        inStock: false,
        description: "Легкі шорти для тренувань",
        category: "clothing",
        size: "S",
        color: "blue",
        forSeason: "summer"
    }
];
const booksData = [
    {
        id: 301,
        name: "Чистий код",
        price: 950,
        inStock: true,
        description: "Книга Роберта Мартіна про якісний код",
        category: "book",
        author: "Robert C. Martin",
        genre: "IT",
        year: 2008
    }
];
// Змішаний масив
const mixed = [
    ...electronicsData,
    ...clothingData,
    ...booksData
];
// Приклади
const foundLaptop = (0, exports.findProduct)(electronicsData, 101);
const under2k = (0, exports.filterByPrice)(mixed, 2000);
let cart = [];
if (foundLaptop) {
    cart = (0, exports.addToCart)(cart, foundLaptop, 1);
}
const hoodie = (0, exports.findProduct)(clothingData, 201);
if (hoodie) {
    cart = (0, exports.addToCart)(cart, hoodie, 2);
}
const grandTotal = (0, exports.calculateTotal)(cart);
console.log("Знайдений ноутбук:", foundLaptop);
console.log("Товари до 2000 грн:", under2k);
console.log("Кошик:", cart);
console.log("Сума:", grandTotal);
