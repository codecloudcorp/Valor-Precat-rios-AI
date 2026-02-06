package com.valorprecatorio.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;
import java.util.List;

@Service
public class EmailService {

    private final WebClient webClient;

    @Value("${app.mail.destinatario}")
    private String destinatarioFinal;

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${resend.sender}")
    private String remetenteResend;

    public EmailService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.resend.com").build();
    }

    public void enviarNotificacaoProposta(String nome, String telefone, String valor, String emailCliente, String mensagemCliente) {
        try {
            System.out.println("Iniciando tentativa de envio de e-mail (API) para: " + destinatarioFinal);
            
            String corpo = String.format("""
                ================================================
                💰 SOLICITAÇÃO DE VENDA DE PRECATÓRIO
                ================================================
                
                DADOS PESSOAIS:
                👤 Nome: %s
                📞 Telefone: %s
                📧 E-mail: %s
                
                DADOS DO ATIVO:
                💲 Valor Estimado: %s
                
                📝 MENSAGEM / OBSERVAÇÕES:
                %s
                
                ================================================
                Enviado via Sistema Valor Precatório AI
                """, nome, telefone, emailCliente, valor, mensagemCliente);

            enviarViaResend("💰 Nova Proposta: " + nome, corpo);
            System.out.println("✅ E-mail de proposta enviado com sucesso.");
        } catch (Exception e) {
            System.err.println("❌ Erro fatal no envio de e-mail: " + e.getMessage());
            throw e;
        }
    }

    public void enviarNotificacaoParceiro(String nome, String telefone, String email, String cpfCnpj, 
                                          String cidade, String profissao, String atua, String leads, String desc) {
        try {
            System.out.println("Iniciando tentativa de envio de e-mail de Parceiro (API)...");

            String corpo = String.format("""
                ================================================
                🤝 FICHA DE INSCRIÇÃO - PARCEIRO
                ================================================
                
                DADOS DE CONTATO:
                👤 Nome Completo: %s
                📞 WhatsApp: %s
                📧 E-mail: %s
                🆔 CPF/CNPJ: %s
                📍 Localização: %s
                💼 Profissão: %s
                
                PERFIL COMERCIAL:
                ⚖️ Já atua com precatórios? %s
                📊 Média de Leads/mês: %s
                
                SOBRE A ATUAÇÃO:
                %s
                
                ================================================
                Entre em contato para validar este parceiro.
                """, nome, telefone, email, cpfCnpj, cidade, profissao, atua, leads, desc);

            enviarViaResend("🤝 Novo Cadastro de Parceiro: " + nome, corpo);
            System.out.println("✅ E-mail de parceiro enviado com sucesso.");
        } catch (Exception e) {
            System.err.println("❌ Erro ao enviar parceiro: " + e.getMessage());
            throw e;
        }
    }

    private void enviarViaResend(String subject, String content) {
        webClient.post()
            .uri("/emails")
            .header("Authorization", "Bearer " + resendApiKey)
            .bodyValue(Map.of(
                "from", remetenteResend,
                "to", List.of(destinatarioFinal),
                "subject", subject,
                "text", content
            ))
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }
}