// simple in-memory store (replace with real DB later)
export const db = {
  users: [],     // { id, email, username, passwordHash }
  products: [],  // { id, title, description, category, price, imageUrl, ownerId, createdAt }
  cart: [],      // { id, userId, productId, qty }
  orders: []     // { id, userId, productId, purchasedAt }
};
