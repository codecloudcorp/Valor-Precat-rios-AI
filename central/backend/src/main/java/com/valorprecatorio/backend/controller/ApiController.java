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
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    private final GeminiService geminiService;
    private final EmailService emailService;

    public ApiController(GeminiService geminiService, EmailService emailService) {
        this.geminiService = geminiService;
        this.emailService = emailService;
    }

    @PostMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chat(@RequestBody ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            return Flux.just("data: Erro: Mensagem vazia.");
        }
        return geminiService.streamChat(request.getHistory(), request.getMessage());
    }

    @PostMapping("/proposal")
    public Mono<ResponseEntity<String>> sendProposal(@RequestBody ProposalRequest request) {
        System.out.println("📩 Recebendo proposta de: " + request.getNome());

        if (request.getNome() == null || request.getTelefone() == null) {
            return Mono.just(ResponseEntity.badRequest().body("Campos obrigatórios faltando."));
        }

        return Mono.fromRunnable(() -> {
            emailService.enviarNotificacaoProposta(
                request.getNome(),
                request.getTelefone(),
                request.getValorEstimado(),
                request.getEmail(),
                request.getMensagem()
            );
        }).subscribeOn(Schedulers.boundedElastic()) 
          .thenReturn(ResponseEntity.ok("Proposta enviada com sucesso!"))
          .onErrorResume(e -> Mono.just(ResponseEntity.internalServerError().body("Erro: " + e.getMessage())));
    }

    @PostMapping("/partner")
    public Mono<ResponseEntity<String>> registerPartner(@RequestBody PartnerRequest request) {
        System.out.println("🤝 Recebendo cadastro de parceiro: " + request.getNome());

        if (request.getNome() == null || request.getCpfCnpj() == null) {
            return Mono.just(ResponseEntity.badRequest().body("Nome e CPF/CNPJ são obrigatórios."));
        }

        return Mono.fromRunnable(() -> {
            emailService.enviarNotificacaoParceiro(
                request.getNome(),
                request.getTelefone(),
                request.getEmail(),
                request.getCpfCnpj(),
                request.getCidadeEstado(),
                request.getProfissao(),
                request.getAtuaComPrecatorios(),
                request.getMediaLeads(),
                request.getDescricao()
            );
        }).subscribeOn(Schedulers.boundedElastic())
          .thenReturn(ResponseEntity.ok("Cadastro de parceiro recebido!"))
          .onErrorResume(e -> Mono.just(ResponseEntity.internalServerError().body("Erro: " + e.getMessage())));
    }
}