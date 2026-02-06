import { ChatMessage, PartnerDTO, ProposalDTO } from "../types";

const API_URL = "http://localhost:3001/api";

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

  // 2. Enviar Proposta
  async sendProposal(data: ProposalDTO): Promise<void> {
    const response = await fetch(`${API_URL}/proposal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Falha ao enviar proposta");
    }
  },

  // 3. Cadastrar Parceiro
  async registerPartner(data: PartnerDTO): Promise<void> {
    const response = await fetch(`${API_URL}/partner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Falha ao cadastrar parceiro");
    }
  }
};