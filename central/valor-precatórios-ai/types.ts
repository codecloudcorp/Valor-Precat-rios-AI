export enum ViewMode {
  CHAT = 'CHAT',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

// DTO para enviar ao Java (Endpoint /api/proposal)
export interface ProposalDTO {
  nome: string;
  telefone: string;
  email: string;
  valorEstimado?: string;
  mensagem?: string;
}

// DTO para enviar ao Java (Endpoint /api/partner)
export interface PartnerDTO {
  nome: string;
  telefone: string;
  email: string;
  cpfCnpj: string;
  cidadeEstado: string;
  profissao?: string;
  atuaComPrecatorios: string; // "Sim" ou "Não"
  mediaLeads: string;
  descricao?: string;
}