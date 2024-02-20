import { promises as fs } from "fs";
import crypto from "crypto";
export class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async readProducts() {
    const prodsData = await fs.readFile(this.path, "utf-8");
    this.products = JSON.parse(prodsData);
    return this.products;
  }

  async writeProductsToFile() {
    await fs.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2),
      "utf8"
    );
  }
  async getProducts() {
    const products = await this.readProducts();
    return products;
  }

  async getProductById(productId) {
    const products = await this.readProducts();
    const product = products.find((prod) => prod.id === productId);
    if (product) return product;
  }

  async addProduct(newProduct) {
    // Validación de propiedades
    if (
      !newProduct.code ||
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      return "Debe ingresar un producto con todas las propiedades";
    }
    //Buscar producto duplicado por código
    const products = await this.readProducts();

    const code = products.findIndex((prod) => prod.code === newProduct.code);
    if (code === -1) {
      newProduct.id = crypto.randomBytes(10).toString("hex");
      newProduct.status = true;
      if (!newProduct.thumbnail) newProduct.thumbnail = [];
      products.push(newProduct);
      await this.writeProductsToFile();
      return "Product successfully added.";
    } else {
      return "Product already exists.";
    }
  }

  async updateProduct(productId, updatedFields) {
    const products = await this.readProducts();

    const index = products.findIndex((prod) => prod.id === productId);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      await this.writeProductsToFile();
      return "Product successfully updated.";
    } else {
      return "Product not found.";
    }
  }

  async deleteProduct(productId) {
    const products = await this.readProducts();
    const index = products.findIndex((prod) => prod.id === productId);
    if (index != -1) {
      products.splice(index, 1);
      await this.writeProductsToFile();
      return "Product successfully deleted.";
    } else {
      return "Product not found.";
    }
  }
}
