package com.yourapp.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DonationRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Minimum donation is ₹1")
    private BigDecimal amount;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}
