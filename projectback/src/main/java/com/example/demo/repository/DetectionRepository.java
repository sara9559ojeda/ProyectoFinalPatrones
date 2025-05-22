
package com.example.demo.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.example.demo.entity.Detection;

@Repository
public interface DetectionRepository extends JpaRepository<Detection, Long> {
    

}