package com.hospital.service;

import com.hospital.model.Billing;
import com.hospital.repository.BillingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillingService {

    @Autowired
    private BillingRepository billingRepository;

    public List<Billing> getAllBillings() {
        return billingRepository.findAll();
    }

    public Optional<Billing> getBillingById(Long id) {
        return billingRepository.findById(id);
    }

    public Billing saveBilling(Billing billing) {
        return billingRepository.save(billing);
    }

    public void deleteBilling(Long id) {
        billingRepository.deleteById(id);
    }
}

