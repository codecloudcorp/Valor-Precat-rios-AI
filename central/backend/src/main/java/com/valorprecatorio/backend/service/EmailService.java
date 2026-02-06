package com.valorprecatorio.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    // Agora o destinatário é lido das configurações
    @Value("${app.mail.destinatario}")
    private String destinatarioFinal;

    // Remetente configurado no application.properties
    @Value("${spring.mail.username}")
    private String remetente;

    // Injeção via construtor (mais robusto)
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * E-mail para PROPOSTA (Venda de Precatório)
     */
    public void enviarNotificacaoProposta(String nome, String telefone, String valor, String emailCliente, String mensagemCliente) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(remetente);
            message.setTo(destinatarioFinal);
            message.setSubject("💰 Nova Proposta: " + nome);
            
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

            message.setText(corpo);
            mailSender.send(message);
            System.out.println("✅ E-mail de proposta enviado com sucesso.");
        } catch (Exception e) {
            System.err.println("❌ Erro ao enviar proposta: " + e.getMessage());
            throw e;
        }
    }

    /**
     * E-mail para PARCEIRO (Formulário Completo)
     */
    public void enviarNotificacaoParceiro(String nome, String telefone, String email, String cpfCnpj, 
                                          String cidade, String profissao, String atua, String leads, String desc) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(remetente);
            message.setTo(destinatarioFinal);
            message.setSubject("🤝 Novo Cadastro de Parceiro: " + nome);

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

            message.setText(corpo);
            mailSender.send(message);
            System.out.println("✅ E-mail de parceiro enviado com sucesso.");
        } catch (Exception e) {
            System.err.println("❌ Erro ao enviar parceiro: " + e.getMessage());
            throw e;
        }
    }
}