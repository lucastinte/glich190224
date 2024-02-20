import { Router } from "express";
import { ProductManager } from "../config/ProductManager.js";
const productManager = new ProductManager("./src/data/products.json");
const productsRouter=Router()

productsRouter.get("/", async (req, res) => {
    try {
    const { limit } = req.query;
    const prods = await productManager.getProducts();
    const limite = parseInt(limit);
    if (!isNaN(limite) && limite >= 0) {
      const prodsLimit = prods.slice(0, limite);
      res.render("templates/home", {
        mostrarProductos: true,
        productos: prodsLimit,
        css: "product.css",
      });
    } else if (!limit) {
      res.render("templates/home", {
        
        mostrarProductos: true,
        productos: prods,
        css: "product.css",
      });
    } else {
      res.status(400).send("Error al consultar productos, Ingrese un valor valido");
    }
  } catch (error) {
   res.status(500).send(`Error interno del servidor al consultar productos:${error}`)   
  }
  });
  
  
  productsRouter.get("/:pid", async (req, res) => {
    try {
    const idProducto = req.params.pid;
    const prod = await productManager.getProductById(idProducto);
    if (prod) {
      
      res.status(200).send(prod);
    } else {
      res.status(404).send("Producto no existe")
    }
      
  } catch (error) {
    res.status(500).send(`Error interno del servidor al consultar producto:${error}`)     
  }
  });
  productsRouter.post("/", async (req, res) => {
    try {
      const newProduct=req.body
     const mensaje = await productManager.addProduct(newProduct);
    if (mensaje=="Product successfully added.") {
      res.status(200).send(mensaje);
    } else {
      res.status(400).send(mensaje)
    }
      
  } catch (error) {
    res.status(500).send(`Error interno del servidor al consultar producto:${error}`)     
  }
  });
  
  productsRouter.put("/:pid", async (req, res) => {
    try {
    const idProducto = req.params.pid;
    const updatedProduct=req.body
     const mensaje = await productManager.updateProduct(idProducto,updatedProduct);
    if (mensaje=="Product successfully updated.") {
      res.status(200).send(mensaje);
    } else {
      res.status(404).send(mensaje)
    }
      
  } catch (error) {
    res.status(500).send(`Error interno del servidor al consultar producto:${error}`)     
  }
  });
  productsRouter.delete("/:pid", async (req, res) => {
    try {
    const idProducto = req.params.pid;
     const mensaje = await productManager.deleteProduct(idProducto);
    if (mensaje=="Product successfully deleted.") {
      res.status(200).send(mensaje);
    } else {
      res.status(404).send(mensaje)
    }
      
  } catch (error) {
    res.status(500).send(`Error interno del servidor al consultar producto:${error}`)     
  }
  });
  export default productsRouter