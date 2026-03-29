package com.ecommerce.ecommerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.ecommerce.model.Product;
import com.ecommerce.ecommerce.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repo;

    // GET all products
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    // ADD product
    public Product addProduct(Product product) {
        return repo.save(product);
    }

    // UPDATE product
    public Product updateProduct(Long id, Product newProduct) {
    Product existing = repo.findById(id).orElseThrow();

    existing.setName(newProduct.getName());
    existing.setPrice(newProduct.getPrice());
    existing.setCategory(newProduct.getCategory()); // Add this line!

    return repo.save(existing);
}

    // DELETE product
    public void deleteProduct(Long id) {
        repo.deleteById(id);
    }
}