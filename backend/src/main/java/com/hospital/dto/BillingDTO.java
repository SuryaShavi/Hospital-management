package com.hospital.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillingDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private String treatment;
    private double amount;
    private String paymentStatus;
    private LocalDate date;
    private String method;
}
