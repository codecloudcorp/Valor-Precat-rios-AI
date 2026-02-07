import { PartnerDTO, ProposalDTO } from "../types";

// URL do Backend Java
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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

  // 2. Enviar Proposta -> CHAMA O JAVA
  async sendProposal(data: ProposalDTO): Promise<void> {
    const response = await fetch(`${API_URL}/proposal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        valorEstimado: data.valorEstimado,
        mensagem: data.mensagem
      })
    });

    if (!response.ok) {
      // Se o Java der erro (ex: timeout do Railway), isso captura
      const errorText = await response.text();
      throw new Error(errorText || "Falha ao enviar proposta pelo servidor");
    }
  },

  // 3. Cadastrar Parceiro -> CHAMA O JAVA
  async registerPartner(data: PartnerDTO): Promise<void> {
    const response = await fetch(`${API_URL}/partner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        cpfCnpj: data.cpfCnpj,
        cidadeEstado: data.cidadeEstado,
        profissao: data.profissao,
        atuaComPrecatorios: data.atuaComPrecatorios,
        mediaLeads: data.mediaLeads,
        descricao: data.descricao
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Falha ao cadastrar parceiro pelo servidor");
    }
  }
};