// ---------- Крок 1. Типи товарів ----------

export type BaseProduct = {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
    description?: string;
};

export type Electronics = BaseProduct & {
    category: "electronics";
    brand: string;
    model: string;
    voltage: number;
};

export type Clothing = BaseProduct & {
    category: "clothing";
    size: "XS" | "S" | "M" | "L" | "XL";
    color: string;
    forSeason: "summer" | "winter" | "all";
};

export type Book = BaseProduct & {
    category: "book";
    author: string;
    genre: string;
    year: number;
};

export type CartItem<T extends BaseProduct> = {
    product: T;
    quantity: number;
};

// ---------- Крок 2. Пошук та фільтрація ----------

export const findProduct = <T extends BaseProduct>(
    products: T[],
    id: number
): T | undefined => {
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

export const filterByPrice = <T extends BaseProduct>(
    products: T[],
    maxPrice: number
): T[] => {
    if (!Array.isArray(products) || !Number.isFinite(maxPrice)) {
        return [];
    }
    if (maxPrice < 0) {
        return [];
    }

    const result: T[] = [];
    for (const item of products) {
        if (item.price <= maxPrice) {
            result.push(item);
        }
    }
    return result;
};

// ---------- Крок 3. Робота з кошиком ----------

export const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    if (!product || quantity <= 0) {
        console.warn("Неправильні дані для додавання в кошик.");
        return cart;
    }

    const existingIndex: number = cart.findIndex(
        (item: CartItem<T>): boolean => item.product.id === product.id
    );

    // робимо копію, щоб не мутувати оригінальний масив
    const updated: CartItem<T>[] = cart.slice();

    if (existingIndex >= 0) {
        const current: CartItem<T> = updated[existingIndex];
        updated[existingIndex] = {
            ...current,
            quantity: current.quantity + quantity
        };
    } else {
        updated.push({ product, quantity });
    }

    return updated;
};

export const calculateTotal = <T extends BaseProduct>(
    cart: CartItem<T>[]
): number => {
    if (!Array.isArray(cart)) {
        return 0;
    }

    let total: number = 0;

    for (const item of cart) {
        if (
            item.quantity > 0 &&
            item.product.price >= 0 &&
            item.product.inStock
        ) {
            total += item.product.price * item.quantity;
        }
    }

    return total;
};

// ---------- Крок 4. Тестові дані та приклад використання ----------

const electronicsData: Electronics[] = [
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

const clothingData: Clothing[] = [
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

const booksData: Book[] = [
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
const mixed: (Electronics | Clothing | Book)[] = [
    ...electronicsData,
    ...clothingData,
    ...booksData
];

// Приклади
const foundLaptop: Electronics | undefined = findProduct<Electronics>(
    electronicsData,
    101
);

const under2k: (Electronics | Clothing | Book)[] = filterByPrice<
    Electronics | Clothing | Book
>(mixed, 2000);

let cart: CartItem<Electronics | Clothing | Book>[] = [];

if (foundLaptop) {
    cart = addToCart(cart, foundLaptop, 1);
}

const hoodie: Clothing | undefined = findProduct<Clothing>(
    clothingData,
    201
);
if (hoodie) {
    cart = addToCart(cart, hoodie, 2);
}

const grandTotal: number = calculateTotal(cart);

console.log("Знайдений ноутбук:", foundLaptop);
console.log("Товари до 2000 грн:", under2k);
console.log("Кошик:", cart);
console.log("Сума:", grandTotal);
