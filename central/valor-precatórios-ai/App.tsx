import React, { useState } from 'react';
import { Scale, MessageSquare, Menu, X, ArrowRight, CheckCircle2, Building2, Phone, Mail, MapPin, TrendingUp, Landmark, Briefcase, Instagram, User, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ViewMode } from './types';
import ChatAssistant from './views/ChatAssistant';
import PartnersPage from './views/PartnersPage';
import { apiService } from './services/apiService'; // Atualizado
import { ProposalDTO } from './types';

const App: React.FC = () => {
  const [isPartnersPage, setIsPartnersPage] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Estados do Formulário de Proposta
  const [proposalData, setProposalData] = useState<ProposalDTO>({
    nome: '', telefone: '', email: '', valorEstimado: '', mensagem: ''
  });
  const [proposalStatus, setProposalStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    if (isPartnersPage) {
      setIsPartnersPage(false);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const goToPartners = () => {
    setIsPartnersPage(true);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProposalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProposalData({ ...proposalData, [e.target.name]: e.target.value });
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProposalStatus('submitting');
    try {
      await apiService.sendProposal(proposalData);
      setProposalStatus('success');
    } catch (error) {
      console.error(error);
      setProposalStatus('error');
    }
  };

  const faqList = [
    { q: "O que é um precatório?", a: "Um precatório é uma ordem de pagamento emitida pelo Poder Judiciário quando o governo é condenado definitivamente a pagar um valor ao cidadão, servidor ou empresa." },
    { q: "Como funciona a venda de um precatório?", a: "A venda acontece por meio de cessão de crédito. O credor transfere o direito de receber o valor para um comprador (geralmente um fundo), recebendo o pagamento antecipado com deságio." },
    { q: "Quem pode comprar um precatório?", a: "Fundos de investimento, empresas e investidores especializados que atendam às exigências legais e apresentem documentação compatível." },
    { q: "Por que fundos compram precatórios?", a: "Porque buscam retorno financeiro no médio/longo prazo, adquirindo o crédito com deságio e aguardando o pagamento integral pelo governo." },
    { q: "Quais documentos são necessários para vender um precatório?", a: "Geralmente: RG/CPF ou contrato social, extrato do precatório, dados bancários, número do processo e documentos complementares solicitados pelo comprador." },
    { q: "Quanto tempo leva para receber o valor ao vender um precatório?", a: "Após aprovação dos documentos e assinatura da cessão, o pagamento é realizado no mesmo dia ou em até 24 horas, conforme o fundo comprador." },
    { q: "É seguro vender um precatório?", a: "Sim, desde que a negociação seja feita com empresas idôneas e documentada. Nosso site inclui IA antifraude e verificação automática de autenticidade." },
    { q: "O site oferece avaliação gratuita?", a: "Sim. Fornecemos avaliação gratuita com estimativa de valor, análise de risco e previsão aproximada de pagamento." },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* --- HEADER / NAVBAR --- */}
      <header className="fixed w-full top-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 shadow-lg">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2.5 rounded-lg shadow-yellow-500/20 shadow-lg">
              <Scale className="text-slate-900" size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight leading-none">VALOR <span className="text-yellow-500">PRECATÓRIO</span></span>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-1">Advocacia & Investimentos</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection('home')} className="hover:text-yellow-500 transition-colors">Início</button>
            <button onClick={() => scrollToSection('sobre')} className="hover:text-yellow-500 transition-colors">Quem Somos</button>
            <button onClick={() => scrollToSection('ferramentas')} className="hover:text-yellow-500 transition-colors">Chatbot IA</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-yellow-500 transition-colors">Dúvidas</button>
            <button onClick={goToPartners} className={`hover:text-yellow-500 transition-colors ${isPartnersPage ? 'text-yellow-500' : ''}`}>Seja Nosso Parceiro</button>
            <button 
              onClick={() => scrollToSection('contato')}
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
            >
              Avaliar Precatório
            </button>
          </nav>

          <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-slate-800 p-6 flex flex-col gap-4 shadow-xl">
            <button onClick={() => scrollToSection('home')} className="text-white text-left py-3 border-b border-slate-800">Início</button>
            <button onClick={() => scrollToSection('sobre')} className="text-white text-left py-3 border-b border-slate-800">Quem Somos</button>
            <button onClick={() => scrollToSection('ferramentas')} className="text-white text-left py-3 border-b border-slate-800">Chatbot IA</button>
            <button onClick={() => scrollToSection('faq')} className="text-white text-left py-3 border-b border-slate-800">Dúvidas Frequentes</button>
            <button onClick={goToPartners} className="text-yellow-500 text-left py-3 border-b border-slate-800 font-bold">Seja Nosso Parceiro</button>
            <button onClick={() => scrollToSection('contato')} className="bg-yellow-500 text-slate-900 py-4 rounded-xl font-bold text-center mt-2">Falar com Especialista</button>
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT SWITCHER --- */}
      {isPartnersPage ? (
        <PartnersPage />
      ) : (
        <>
          {/* --- HERO SECTION --- */}
          <section id="home" className="pt-40 pb-24 bg-slate-950 text-white relative overflow-hidden min-h-[85vh] flex flex-col items-center justify-center">
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-slate-900 to-transparent opacity-50"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
            
            <div className="container mx-auto px-6 relative z-20 flex flex-col items-center text-center">
              <div className="mx-auto text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-yellow-400 tracking-wide uppercase">Inteligência Artificial Ativa 24h</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
                  Seu precatório,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500">seu valor</span>, no seu tempo.
                </h1>
                
                <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto border-none">
                  Transformando créditos em oportunidades reais. Somos especialistas na intermediação de ativos judiciais junto aos maiores fundos do Brasil.
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center flex-wrap">
                  <button onClick={() => scrollToSection('ferramentas')} className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-yellow-500/20 hover:-translate-y-1">
                    <MessageSquare size={22} className="text-slate-900" />
                    Analisar Meu Precatório
                  </button>
                  <button onClick={() => scrollToSection('contato')} className="group bg-transparent border border-slate-600 hover:border-yellow-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:bg-yellow-500/5">
                    Falar com Consultor
                    <ArrowRight className="group-hover:translate-x-1 transition-transform text-yellow-500" size={20} />
                  </button>
                  <button onClick={goToPartners} className="group bg-slate-800/40 hover:bg-slate-800 border border-slate-600 hover:border-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all">
                    <Briefcase size={20} className="text-blue-400 group-hover:text-blue-300" />
                    Seja Nosso Parceiro
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* --- TRUST / PARTNERS --- */}
          <section className="py-16 bg-white relative z-20 -mt-10 rounded-t-[3rem] border-t border-slate-100">
            <div className="container mx-auto px-6">
              <p className="text-center text-slate-500 text-sm font-bold uppercase tracking-widest mb-10">
                Parceiros de Negócios & Investidores Institucionais
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                    <div className="bg-yellow-100 p-4 rounded-full text-yellow-600 group-hover:scale-110 transition-transform">
                      <Building2 size={32} />
                    </div>
                    <span className="font-bold text-slate-700 text-center">Fundos de Investimento</span>
                 </div>
                 <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                    <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                      <Landmark size={32} />
                    </div>
                    <span className="font-bold text-slate-700 text-center">Bancos Tradicionais</span>
                 </div>
                 <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                    <div className="bg-slate-200 p-4 rounded-full text-slate-700 group-hover:scale-110 transition-transform">
                      <Briefcase size={32} />
                    </div>
                    <span className="font-bold text-slate-700 text-center">Family Offices</span>
                 </div>
                 <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                    <div className="bg-green-100 p-4 rounded-full text-green-600 group-hover:scale-110 transition-transform">
                      <TrendingUp size={32} />
                    </div>
                    <span className="font-bold text-slate-700 text-center">Gestoras de Ativos</span>
                 </div>
              </div>
            </div>
          </section>

          {/* --- ABOUT SECTION --- */}
          <section id="sobre" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 relative">
                   <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl transform -rotate-2"></div>
                   <div className="relative bg-white p-8 rounded-3xl shadow-xl border-2 border-blue-600">
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                        <div className="w-16 h-16 bg-white border-2 border-blue-600 rounded-full overflow-hidden flex items-center justify-center shadow-md">
                           <User size={32} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900">Sacha Begara de Miranda</h4>
                          <p className="text-sm text-blue-600 font-semibold">OAB GO 30.020</p>
                          <p className="text-xs text-slate-500">Pós-graduado em Direito Tributário</p>
                        </div>
                      </div>
                      <blockquote className="text-slate-600 italic leading-relaxed mb-6">
                        "Nosso objetivo é garantir que o credor receba o valor justo pelo seu direito, com total segurança jurídica e a liquidez que ele precisa hoje, não daqui a 10 anos."
                      </blockquote>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Compliance</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Due Diligence</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Cessão de Crédito</span>
                      </div>
                   </div>
                </div>
                
                <div className="order-1 lg:order-2">
                  <h2 className="text-4xl font-bold text-slate-900 mb-6">
                    Intermediação Profissional de <span className="text-blue-600">Precatórios</span>
                  </h2>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    Atuamos como a ponte segura entre credores de precatórios federais, estaduais ou municipais e os maiores investidores do mercado.
                  </p>
                  
                  <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="mt-1 bg-yellow-500 rounded-full p-1 text-white"><CheckCircle2 size={14} /></div>
                        <span className="text-slate-700">Análise jurídica detalhada sem custo</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 bg-yellow-500 rounded-full p-1 text-white"><CheckCircle2 size={14} /></div>
                        <span className="text-slate-700">Pagamento à vista após a assinatura da Escritura Pública</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 bg-yellow-500 rounded-full p-1 text-white"><CheckCircle2 size={14} /></div>
                        <span className="text-slate-700">Sem honorários por parte do credor</span>
                      </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* --- APP SECTION (TOOLS) --- */}
          <section id="ferramentas" className="py-24 bg-slate-900 text-white scroll-mt-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Chatbot <span className="text-yellow-500">Valor AI</span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                  Tecnologia exclusiva para esclarecer dúvidas jurídicas sobre seu processo e precatórios em segundos.
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-7xl mx-auto border border-slate-700/50 flex flex-col h-[900px]">
                 <div className="flex-1 bg-slate-100 overflow-hidden relative">
                   <ChatAssistant />
                 </div>
              </div>
            </div>
          </section>

          {/* --- FAQ SECTION --- */}
          <section id="faq" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4">
                  <HelpCircle size={14} />
                  Perguntas Frequentes
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tire Suas Dúvidas</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
                {faqList.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <button 
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-semibold text-slate-800 pr-4">{item.q}</span>
                      {openFaqIndex === index ? <ChevronUp className="text-blue-600 flex-shrink-0" size={20} /> : <ChevronDown className="text-slate-400 flex-shrink-0" size={20} />}
                    </button>
                    {openFaqIndex === index && (
                      <div className="px-5 pb-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        <div className="pt-3">{item.a}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- CTA / CONTACT --- */}
          <section id="contato" className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900 mb-4">Entre em Contato</h2>
                <p className="text-slate-600 text-lg">Nossa equipe de especialistas está pronta para analisar seu caso.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                
                {/* Left Column */}
                <div className="space-y-8">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform"><Phone size={24} /></div>
                        <div><p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Ligue Agora</p><p className="text-2xl font-bold text-slate-900">(62) 99933-4004</p></div>
                      </div>
                      <p className="text-slate-500 leading-relaxed">Atendimento exclusivo para credores. Tire suas dúvidas diretamente com um especialista.</p>
                  </div>

                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><Mail size={24} /></div>
                        <div><p className="text-sm font-bold text-slate-400 uppercase tracking-wider">E-mail</p><p className="text-xl font-bold text-slate-900 break-all">contato@valorprecatorio.adv.br</p></div>
                      </div>
                  </div>

                  <div className="p-6 border-l-4 border-yellow-500 bg-white shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-2">Unidades</h4>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <MapPin className="text-slate-400 flex-shrink-0 mt-1" size={18} />
                        <p className="text-sm text-slate-600"><strong className="block text-slate-800">Florianópolis - SC</strong>Rua Servidão Bento da Silveira, nº 34, Sala 02<br/>Lagoa da Conceição - CEP 88.062-207</p>
                      </div>
                      <div className="flex gap-3">
                        <MapPin className="text-slate-400 flex-shrink-0 mt-1" size={18} />
                        <p className="text-sm text-slate-600"><strong className="block text-slate-800">Goiânia - GO</strong>Rua 28, SN Qd. A9, Lt. 17<br/>Jardim Goiás - CEP 74.805-310</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: The Form */}
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 relative">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-yellow-500 text-slate-900 font-bold px-6 py-2 rounded-full shadow-lg transform rotate-3">
                    Resposta em 24h
                  </div>
                  
                  {proposalStatus === 'success' ? (
                    <div className="text-center py-10">
                        <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
                        <h3 className="text-2xl font-bold text-slate-900">Solicitação Enviada!</h3>
                        <p className="text-slate-500 mt-2">Nossa equipe entrará em contato em breve.</p>
                        <button onClick={() => setProposalStatus('idle')} className="mt-6 text-blue-600 font-bold hover:underline">Nova Solicitação</button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Solicite uma Proposta</h3>
                      <p className="text-slate-500 mb-8">Preencha os dados abaixo para receber uma avaliação preliminar do seu precatório.</p>
                      
                      <form className="space-y-5" onSubmit={handleProposalSubmit}>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo</label>
                          <input required name="nome" value={proposalData.nome} onChange={handleProposalChange} type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Digite seu nome" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Telefone / WhatsApp</label>
                            <input required name="telefone" value={proposalData.telefone} onChange={handleProposalChange} type="tel" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="(DDD) 00000-0000" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Valor Estimado (R$)</label>
                            <input name="valorEstimado" value={proposalData.valorEstimado} onChange={handleProposalChange} type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Ex: 50.000,00" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
                          <input required name="email" value={proposalData.email} onChange={handleProposalChange} type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="seu@email.com" />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Mensagem ou Observações</label>
                          <textarea name="mensagem" value={proposalData.mensagem} onChange={handleProposalChange} rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Qual o tribunal? Ano do processo?" />
                        </div>

                        {proposalStatus === 'error' && <p className="text-red-600 text-sm text-center">Erro ao enviar. Verifique os campos e tente novamente.</p>}

                        <button 
                          type="submit" 
                          disabled={proposalStatus === 'submitting'}
                          className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-5 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {proposalStatus === 'submitting' ? 'Enviando...' : 'Enviar Solicitação'}
                          {!proposalStatus && <ArrowRight size={20} className="text-slate-900" />}
                        </button>
                      </form>
                    </>
                  )}
                </div>

              </div>
            </div>
          </section>
        </>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Scale className="text-yellow-500" size={24} />
                <span className="text-lg font-bold text-white">Valor Precatório</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
                Especialistas em transformar ativos judiciais em liquidez imediata. Segurança jurídica e transparência em cada etapa.
              </p>
              <div className="text-sm text-slate-500">
                <p>B & M Negócios Ltda.</p>
                <p>CNPJ 58.500491/0001-10</p>
              </div>
              <div className="flex gap-4 pt-2">
                <a href="https://instagram.com/valorprecatorio.adv" target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-900 rounded-lg hover:bg-yellow-500 hover:text-slate-900 flex items-center justify-center transition-all"><Instagram size={18} /></a>
                <a href="mailto:contato@valorprecatorio.adv.br" className="w-10 h-10 bg-slate-900 rounded-lg hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all"><Mail size={18} /></a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Navegação</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-yellow-500 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> Início</button></li>
                <li><button onClick={() => scrollToSection('sobre')} className="hover:text-yellow-500 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-700 hover:bg-yellow-500 rounded-full transition-colors"></span> Quem Somos</button></li>
                <li><button onClick={() => scrollToSection('ferramentas')} className="hover:text-yellow-500 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-700 hover:bg-yellow-500 rounded-full transition-colors"></span> Chatbot IA</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-yellow-500 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-700 hover:bg-yellow-500 rounded-full transition-colors"></span> Dúvidas Frequentes</button></li>
                <li><button onClick={goToPartners} className="hover:text-yellow-500 transition-colors flex items-center gap-2 text-yellow-500 font-medium"><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> Seja Nosso Parceiro</button></li>
                <li><button onClick={() => scrollToSection('contato')} className="hover:text-yellow-500 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-slate-700 hover:bg-yellow-500 rounded-full transition-colors"></span> Contato</button></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
               <h4 className="text-white font-bold mb-6 text-lg">Escritório</h4>
               <div className="flex gap-3 items-start">
                  <MapPin className="text-yellow-500 mt-1 flex-shrink-0" size={18} />
                  <div className="text-sm text-slate-400">
                    <strong className="block text-slate-200 mb-1">Unidades</strong>
                    <p>Florianópolis - SC</p>
                    <p>Goiânia - GO</p>
                  </div>
               </div>
               <div className="flex gap-3 items-start">
                  <User className="text-yellow-500 mt-1 flex-shrink-0" size={18} />
                  <div className="text-sm text-slate-400">
                    <strong className="block text-slate-200 mb-1">Responsável Técnico</strong>
                    <p>Sacha Begara de Miranda</p>
                    <p className="text-xs uppercase mt-0.5">OAB GO 30.020</p>
                  </div>
               </div>
               <div className="pt-4 border-t border-slate-900">
                 <a href="tel:62999334004" className="text-lg font-bold text-white hover:text-yellow-500 transition-colors block">(62) 99933-4004</a>
                 <a href="mailto:contato@valorprecatorio.adv.br" className="text-sm text-slate-500 hover:text-yellow-500 transition-colors">contato@valorprecatorio.adv.br</a>
               </div>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <p>&copy; {new Date().getFullYear()} Valor Precatório. Todos os direitos reservados.</p>
            <p className="max-w-md text-center md:text-right">
              Este site não tem vínculo oficial com tribunais. Somos uma empresa privada de intermediação de ativos judiciais.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;