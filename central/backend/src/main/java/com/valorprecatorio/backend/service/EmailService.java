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

    @Value("${spring.mail.username}")
    private String remetenteOriginal;

    @Value("${spring.mail.password}")
    private String resendApiKey;

    public EmailService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.resend.com").build();
    }

    public void enviarNotificacaoProposta(String nome, String telefone, String valor, String emailCliente, String mensagemCliente) {
        try {
            System.out.println("Tentando enviar e-mail via API para: " + destinatarioFinal);
            
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

            enviarPelaAPI("💰 Nova Proposta: " + nome, corpo);
            System.out.println("✅ Sucesso ao enviar e-mail de proposta.");
        } catch (Exception e) {
            System.err.println("❌ Erro no envio da proposta: " + e.getMessage());
            throw e;
        }
    }

    public void enviarNotificacaoParceiro(String nome, String telefone, String email, String cpfCnpj, 
                                          String cidade, String profissao, String atua, String leads, String desc) {
        try {
            System.out.println("Tentando enviar e-mail de parceiro via API...");

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

            enviarPelaAPI("🤝 Novo Cadastro de Parceiro: " + nome, corpo);
            System.out.println("✅ Sucesso ao enviar e-mail de parceiro.");
        } catch (Exception e) {
            System.err.println("❌ Erro ao enviar parceiro: " + e.getMessage());
            throw e;
        }
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
            .block();
    }
}