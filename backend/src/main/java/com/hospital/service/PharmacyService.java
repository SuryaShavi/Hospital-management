package com.hospital.service;

import com.hospital.model.Pharmacy;
import com.hospital.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PharmacyService {

    private final PharmacyRepository pharmacyRepository;

    public List<Pharmacy> getAllMedications() {
        return pharmacyRepository.findAll();
    }

    public Optional<Pharmacy> getMedicationById(@NonNull Long id) {
        return pharmacyRepository.findById(id);
    }

    public Pharmacy saveMedication(Pharmacy pharmacy) {
        return pharmacyRepository.save(pharmacy);
    }

    public void deleteMedication(@NonNull Long id) {
        pharmacyRepository.deleteById(id);
    }
}

