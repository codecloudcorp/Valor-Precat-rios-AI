package com.valorprecatorio.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
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
        // Criando um cliente com timeouts explícitos para o Railway não "matar" a conexão
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofSeconds(15)) // Espera até 15s pela Resend
                .resolver(spec -> spec.queryTimeout(Duration.ofSeconds(5))); // Timeout de DNS de 5s

        this.webClient = webClientBuilder
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl("https://api.resend.com")
                .build();
    }

    public void enviarNotificacaoProposta(String nome, String telefone, String valor, String emailCliente, String mensagemCliente) {
        System.out.println("🚀 Tentativa de envio para: " + destinatarioFinal);
        
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
                                          String city, String profession, String atua, String leads, String desc) {
        System.out.println("🤝 Tentativa de envio de parceiro para: " + destinatarioFinal);

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
            nome, telefone, email, cpfCnpj, city, profession, atua, leads, desc);

        enviarPelaAPI("🤝 Novo Cadastro de Parceiro: " + nome, corpo);
    }

    private void enviarPelaAPI(String subject, String content) {
        webClient.post()
            .uri("/emails")
            .header("Authorization", "Bearer " + resendApiKey)
            .header("Content-Type", "application/json")
            .bodyValue(Map.of(
                "from", "onboarding@resend.dev",
                "to", List.of(destinatarioFinal),
                "subject", subject,
                "text", content
            ))
            .retrieve()
            .bodyToMono(String.class)
            .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(5))) // Tenta a cada 5 segundos
            .subscribe(
                response -> System.out.println("✅ RESEND CONFIRMOU ENVIO: " + response),
                error -> {
                    System.err.println("❌ FALHA FINAL: " + error.getMessage());
                    // Se o erro disser "403 Forbidden", sua chave no Railway está errada ou sem permissão.
                }
            );
    }
}