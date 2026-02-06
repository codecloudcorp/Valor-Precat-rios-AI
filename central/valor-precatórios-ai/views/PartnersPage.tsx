import React, { useState } from 'react';
import { CheckCircle2, DollarSign, LayoutDashboard, Bot, FileText, Headphones, ArrowRight, Briefcase, User, Mail, Phone, MapPin, Send, X, ShieldCheck, BellRing } from 'lucide-react';
import { apiService } from '../services/apiService';
import { PartnerDTO } from '../types';

// --- COMPONENTE DO MODAL DE TERMOS ---
const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="text-blue-600" size={24} />
            Termos de Parceria
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-8 text-slate-600 space-y-6 text-sm leading-relaxed">
          <section>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-green-600" /> 1. Objeto da Parceria
            </h4>
            <p>O presente termo estabelece as condições para que o Parceiro atue na prospecção e indicação de detentores de ativos judiciais para a Valor Precatório. Esta relação é de natureza autônoma e não configura vínculo empregatício.</p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 mb-2">2. Remuneração e Comissões</h4>
            <p>As comissões serão devidas exclusivamente sobre negócios efetivamente concluídos, com escritura assinada e liquidação financeira. Os percentuais variam conforme a natureza do ativo e serão acordados previamente à conclusão de cada caso.</p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <BellRing size={18} className="text-blue-600" /> 3. Comunicações e LGPD
            </h4>
            <p>Ao aceitar este termo, você autoriza expressamente a Valor Precatório a enviar comunicações via WhatsApp e E-mail sobre o status das suas indicações e atualizações do programa. Seus dados e os dos indicados serão tratados conforme a Lei Geral de Proteção de Dados.</p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 mb-2">4. Ética e Sigilo</h4>
            <p>O parceiro compromete-se a não realizar promessas de valores de compra sem a prévia avaliação da Valor Precatório e a manter sigilo absoluto sobre informações comerciais internas.</p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-right">
          <button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            Entendi e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const PartnersPage: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isTermsOpen, setIsTermsOpen] = useState(false); // Estado para o Modal
  
  const [formData, setFormData] = useState<PartnerDTO>({
    nome: '',
    telefone: '',
    email: '',
    cpfCnpj: '',
    cidadeEstado: '',
    profissao: '',
    atuaComPrecatorios: 'Sim',
    mediaLeads: 'Menos de 5',
    descricao: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const scrollToForm = () => {
    document.getElementById('cadastro-parceiro')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      await apiService.registerPartner(formData);
      setFormStatus('success');
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    }
  };

  const benefits = [
    { icon: <DollarSign size={32} />, title: "Comissões Altas", description: "Ganhe por cada credor ou fundo indicado. Modelo de remuneração agressivo e transparente." },
    { icon: <LayoutDashboard size={32} />, title: "Dashboard Exclusivo", description: "Acompanhe suas indicações, comissões e status das negociações em tempo real." },
    { icon: <Bot size={32} />, title: "Ferramentas com IA", description: "Acesso a ferramentas exclusivas de gerenciamento, plataforma jurídica de captação de leads." },
    { icon: <FileText size={32} />, title: "Material de Apoio", description: "Receba PDFs, vídeos explicativos e scripts profissionais para abordar seus clientes." },
    { icon: <Headphones size={32} />, title: "Atendimento Prioritário", description: "Canal exclusivo de suporte para parceiros tirarem dúvidas jurídicas e comerciais." },
    { icon: <Briefcase size={32} />, title: "Recebimento de Leads", description: "Nossos parceiros recebem diversos leads, é só você fechar negócio e o resto é com a gente." }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-900/20 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
             <Briefcase size={16} className="text-blue-400" />
             <span className="text-xs font-semibold text-blue-200 tracking-wide uppercase">Programa de Parcerias Valor Precatórios</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 max-w-4xl mx-auto">
            Torne-se Parceiro da Maior Plataforma de <span className="text-yellow-500">Compra e Venda de Precatórios</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Ganhe comissões, aumente sua renda e tenha acesso a ferramentas exclusivas para intermediação de precatórios.
          </p>
          
          <button 
            onClick={scrollToForm}
            className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-yellow-500/20"
          >
            Quero ser Parceiro Agora
            <ArrowRight size={22} />
          </button>
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Por que ser nosso parceiro?</h2>
            <p className="text-slate-600 text-lg">Oferecemos toda a estrutura para você escalar seus ganhos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-yellow-400/50 transition-all group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-yellow-600 shadow-sm mb-6 group-hover:scale-110 transition-transform border border-slate-100">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REGISTRATION FORM --- */}
      <section id="cadastro-parceiro" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
            
            {formStatus === 'success' ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Cadastro Recebido!</h3>
                <p className="text-lg text-slate-600 mb-8">
                  Obrigado! Em breve nossa equipe entrará em contato.
                </p>
                <button 
                  onClick={() => { setFormStatus('idle'); setFormData({ nome: '', telefone: '', email: '', cpfCnpj: '', cidadeEstado: '', profissao: '', atuaComPrecatorios: 'Sim', mediaLeads: 'Menos de 5', descricao: '' }); }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Enviar outro cadastro
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Formulário de Inscrição</h3>
                  <p className="text-slate-500">Junte-se ao time Valor Precatório</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><User size={16}/> Nome Completo</label>
                      <input required name="nome" value={formData.nome} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Seu nome" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><Phone size={16}/> Telefone (WhatsApp)</label>
                      <input required name="telefone" value={formData.telefone} onChange={handleChange} type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="(00) 00000-0000" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><Mail size={16}/> E-mail</label>
                      <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="seu@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">CPF ou CNPJ</label>
                      <input required name="cpfCnpj" value={formData.cpfCnpj} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="000.000.000-00" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><MapPin size={16}/> Cidade / Estado</label>
                      <input required name="cidadeEstado" value={formData.cidadeEstado} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Ex: São Paulo - SP" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Profissão (Opcional)</label>
                      <input name="profissao" value={formData.profissao} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Advogado, Contador, etc." />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Já atua com precatórios?</label>
                      <select name="atuaComPrecatorios" value={formData.atuaComPrecatorios} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                        <option>Sim</option>
                        <option>Não</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Média de leads / mês</label>
                      <select name="mediaLeads" value={formData.mediaLeads} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                        <option>Menos de 5</option>
                        <option>5 a 20</option>
                        <option>20 a 50</option>
                        <option>Mais de 50</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Fale um pouco sobre sua atuação</label>
                    <textarea name="descricao" value={formData.descricao} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" rows={3} placeholder="Descreva brevemente como pretende indicar clientes..."></textarea>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <input required type="checkbox" id="terms" className="mt-1 w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
                    <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                      Li e aceito os <button 
                        type="button" 
                        onClick={() => setIsTermsOpen(true)} 
                        className="text-blue-600 font-bold underline hover:text-blue-800 transition-colors"
                      >
                        Termos de Parceria
                      </button> e concordo em receber comunicações sobre o programa.
                    </label>
                  </div>

                  {formStatus === 'error' && <p className="text-red-600 text-center text-sm">Erro ao enviar cadastro. Tente novamente.</p>}

                  <button 
                    type="submit" 
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'submitting' ? 'Enviando...' : 'Quero ser Parceiro'}
                    {!formStatus && <Send size={20} className="text-slate-900" />}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* MODAL DE TERMOS */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
};

export default PartnersPage;