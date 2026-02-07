import { PartnerDTO, ProposalDTO } from "../types";
import emailjs from '@emailjs/browser';

// URL do Backend Java (Mantido para o Chatbot)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// ⚠️ CONFIGURAÇÃO DO EMAILJS (Crie conta grátis em emailjs.com)
// O plano grátis permite 200 e-mails/mês usando seu próprio Gmail.
// Preencha com as chaves que você pegar no painel do EmailJS.
const EMAILJS_SERVICE_ID = "service_xxxxxxx"; // Ex: service_gmail
const EMAILJS_TEMPLATE_PROPOSTA = "template_xxxxxxx"; // Crie um template para Proposta
const EMAILJS_TEMPLATE_PARCEIRO = "template_xxxxxxx"; // Crie um template para Parceiro
const EMAILJS_PUBLIC_KEY = "xxxxxxxxxxxxxx"; // Sua Public Key

export const apiService = {

  // 1. Chatbot com Streaming (Continua usando o Java/Gemini)
  async sendMessageStream(history: { role: string; parts: { text: string }[] }[], message: string): Promise<ReadableStreamDefaultReader<Uint8Array>> {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: history,
        message: message
      })
    });

    if (!response.body) throw new Error("Sem resposta do servidor");
    return response.body.getReader();
  },

  // 2. Enviar Proposta (AGORA VIA FRONTEND - IGNORA O RAILWAY)
  async sendProposal(data: ProposalDTO): Promise<void> {
    // Mapeamos os dados do DTO para as variáveis {{variavel}} do seu template no EmailJS
    const templateParams = {
        to_name: "Dra. Sacha",
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        valor: data.valorEstimado,
        mensagem: data.mensagem
    };

    try {
        console.log("📨 Enviando proposta via EmailJS...");
        await emailjs.send(
            EMAILJS_SERVICE_ID, 
            EMAILJS_TEMPLATE_PROPOSTA, 
            templateParams, 
            EMAILJS_PUBLIC_KEY
        );
        console.log("✅ Proposta enviada com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao enviar via EmailJS:", error);
        throw new Error("Falha ao enviar proposta. Verifique a conexão.");
    }
  },

  // 3. Cadastrar Parceiro (AGORA VIA FRONTEND - IGNORA O RAILWAY)
  async registerPartner(data: PartnerDTO): Promise<void> {
    const templateParams = {
        to_name: "Dra. Sacha",
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        cpf_cnpj: data.cpfCnpj,
        cidade: data.cidadeEstado,
        profissao: data.profissao,
        atua: data.atuaComPrecatorios,
        leads: data.mediaLeads,
        descricao: data.descricao
    };

    try {
        console.log("📨 Enviando parceiro via EmailJS...");
        await emailjs.send(
            EMAILJS_SERVICE_ID, 
            EMAILJS_TEMPLATE_PARCEIRO, 
            templateParams, 
            EMAILJS_PUBLIC_KEY
        );
        console.log("✅ Parceiro enviado com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao enviar via EmailJS:", error);
        throw new Error("Falha ao cadastrar parceiro.");
    }
  }
};