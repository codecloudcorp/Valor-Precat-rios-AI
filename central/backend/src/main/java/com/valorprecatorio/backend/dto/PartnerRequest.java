package com.valorprecatorio.backend.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class PartnerRequest {
    private String nome;
    private String telefone;
    private String email;
    private String cpfCnpj;
    private String cidadeEstado;
    private String profissao;
    private String atuaComPrecatorios; // "Sim" ou "Não"
    private String mediaLeads;
    private String descricao;
}