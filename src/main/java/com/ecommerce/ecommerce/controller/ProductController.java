package com.ecommerce.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.ecommerce.model.Product;
import com.ecommerce.ecommerce.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Allows your Live Server to talk to the backend
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping
    public List<Product> getAll() { return service.getAllProducts(); }

    @PostMapping
    public Product add(@RequestBody Product product) { return service.addProduct(product); }

    // This method was likely being blocked by the browser
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteProduct(id);
        return "Product deleted successfully";
    }
}