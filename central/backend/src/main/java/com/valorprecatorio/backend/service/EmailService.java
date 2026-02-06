package com.valorprecatorio.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;
import java.time.Duration;
import java.util.Map;
import java.util.List;

@Service
public class EmailService {

    private final WebClient webClient;

    @Value("${app.mail.destinatario}")
    private String destinatarioFinal;

    @Value("${spring.mail.password}")
    private String resendApiKey;

    public EmailService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.resend.com").build();
    }

    public void enviarNotificacaoProposta(String nome, String telefone, String valor, String emailCliente, String mensagemCliente) {
        System.out.println("Tentando enviar proposta para: " + destinatarioFinal);
        
        String corpo = String.format("""
            ================================================
            💰 SOLICITAÇÃO DE VENDA DE PRECATÓRIO
            ================================================
            👤 Nome: %s
            📞 Telefone: %s
            📧 E-mail: %s
            💲 Valor: %s
            📝 MENSAGEM: %s
            ================================================""", 
            nome, telefone, emailCliente, valor, mensagemCliente);

        enviarPelaAPI("💰 Nova Proposta: " + nome, corpo);
    }

    public void enviarNotificacaoParceiro(String nome, String telefone, String email, String cpfCnpj, 
                                          String cidade, String profissao, String atua, String leads, String desc) {
        System.out.println("Tentando enviar parceiro para: " + destinatarioFinal);

        String corpo = String.format("""
            ================================================
            🤝 FICHA DE INSCRIÇÃO - PARCEIRO
            ================================================
            👤 Nome: %s
            📞 WhatsApp: %s
            📧 E-mail: %s
            🆔 CPF/CNPJ: %s
            📍 Localização: %s
            💼 Profissão: %s
            ⚖️ Já atua? %s
            📊 Leads/mês: %s
            📝 SOBRE: %s
            ================================================""", 
            nome, telefone, email, cpfCnpj, cidade, profissao, atua, leads, desc);

        enviarPelaAPI("🤝 Novo Parceiro: " + nome, corpo);
    }

    private void enviarPelaAPI(String subject, String content) {
        webClient.post()
            .uri("/emails")
            .header("Authorization", "Bearer " + resendApiKey)
            .bodyValue(Map.of(
                "from", "onboarding@resend.dev",
                "to", List.of(destinatarioFinal),
                "subject", subject,
                "text", content
            ))
            .retrieve()
            .bodyToMono(String.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(2))) // Resolve falhas de rede/DNS
            .subscribe(
                response -> System.out.println("✅ RESEND OK: " + response),
                error -> System.err.println("❌ ERRO RESEND: " + error.getMessage())
            );
    }
}