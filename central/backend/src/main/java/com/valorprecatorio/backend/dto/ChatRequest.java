package com.valorprecatorio.backend.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ChatRequest {
    private List<Map<String, Object>> history; // Histórico vindo do front
    private String message;
}