import { PartnerDTO, ProposalDTO } from "../types";

// Usa a variável de ambiente se existir (Produção), senão usa localhost (Desenvolvimento)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
// src/services/apiService.ts

export const apiService = {
  // 1. Chatbot com Streaming
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

  // 2. Enviar Proposta - SINCRONIZADO COM O JAVA
  async sendProposal(data: ProposalDTO): Promise<void> {
    const response = await fetch(`${API_URL}/proposal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        valorEstimado: data.valorEstimado, // Nome exato no ProposalRequest.java
        mensagem: data.mensagem            // Nome exato no ProposalRequest.java
      })
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar proposta");
    }
  },

  // 3. Cadastrar Parceiro - SINCRONIZADO COM O JAVA
  async registerPartner(data: PartnerDTO): Promise<void> {
    const response = await fetch(`${API_URL}/partner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        cpfCnpj: data.cpfCnpj,
        cidadeEstado: data.cidadeEstado, // Nome exato no PartnerRequest.java
        profissao: data.profissao,
        atuaComPrecatorios: data.atuaComPrecatorios, // Nome exato no PartnerRequest.java
        mediaLeads: data.mediaLeads,
        descricao: data.descricao
      })
    });

    if (!response.ok) {
      throw new Error("Falha ao cadastrar parceiro");
    }
  }
};