package com.ecommerce.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.ecommerce.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}