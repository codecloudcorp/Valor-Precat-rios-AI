package com.valorprecatorio.backend.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ProposalRequest {
    private String nome;
    private String telefone;
    private String valorEstimado;
    private String email;
    private String mensagem;
}