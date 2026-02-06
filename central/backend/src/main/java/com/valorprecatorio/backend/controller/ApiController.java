package com.valorprecatorio.backend.controller;

import com.valorprecatorio.backend.dto.ChatRequest;
import com.valorprecatorio.backend.dto.PartnerRequest;
import com.valorprecatorio.backend.dto.ProposalRequest;
import com.valorprecatorio.backend.service.EmailService;
import com.valorprecatorio.backend.service.GeminiService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Permite acesso do React
public class ApiController {

    private final GeminiService geminiService;
    private final EmailService emailService;

    public ApiController(GeminiService geminiService, EmailService emailService) {
        this.geminiService = geminiService;
        this.emailService = emailService;
    }

    // --- ROTA 1: CHATBOT ---
    @PostMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chat(@RequestBody ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return Flux.just("Erro: Mensagem vazia.");
        }
        return geminiService.streamChat(request.getHistory(), request.getMessage());
    }

    // --- ROTA 2: PROPOSTA (Atualizada com TODOS os campos) ---
    @PostMapping("/proposal")
    public ResponseEntity<String> sendProposal(@RequestBody ProposalRequest request) {
        // Validação básica
        if (request.getNome() == null || request.getTelefone() == null) {
            return ResponseEntity.badRequest().body("Campos obrigatórios faltando.");
        }

        try {
            // Agora passamos TUDO, inclusive o e-mail do cliente
            emailService.enviarNotificacaoProposta(
                request.getNome(),
                request.getTelefone(),
                request.getValorEstimado(),
                request.getEmail(), // <--- ADICIONADO
                request.getMensagem()
            );
            return ResponseEntity.ok("Proposta enviada com sucesso!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro ao enviar e-mail.");
        }
    }

    // --- ROTA 3: PARCEIRO (Atualizada com TODOS os campos) ---
    @PostMapping("/partner")
    public ResponseEntity<String> registerPartner(@RequestBody PartnerRequest request) {
        // Validação básica
        if (request.getNome() == null || request.getCpfCnpj() == null) {
            return ResponseEntity.badRequest().body("Nome e CPF/CNPJ são obrigatórios.");
        }

        try {
            // Passando TODOS os 9 campos para o serviço de e-mail montar a ficha completa
            emailService.enviarNotificacaoParceiro(
                request.getNome(),
                request.getTelefone(),
                request.getEmail(),             // <--- ADICIONADO
                request.getCpfCnpj(),           // <--- ADICIONADO
                request.getCidadeEstado(),      // <--- ADICIONADO
                request.getProfissao(),
                request.getAtuaComPrecatorios(),// <--- ADICIONADO
                request.getMediaLeads(),        // <--- ADICIONADO
                request.getDescricao()          // <--- ADICIONADO
            );
            return ResponseEntity.ok("Cadastro de parceiro recebido!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro ao processar cadastro.");
        }
    }
}