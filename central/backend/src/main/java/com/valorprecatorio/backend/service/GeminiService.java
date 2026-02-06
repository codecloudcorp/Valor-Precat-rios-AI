package com.valorprecatorio.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    // BANCO DE DADOS DE RESPOSTAS PRONTAS (CACHE)
    private final Map<String, String> faqDatabase = new HashMap<>();

    private static final String SYSTEM_INSTRUCTION = """
        🟦 PROMPT DO SISTEMA / ASSISTENTE JURÍDICO SÊNIOR — valorprecatorios.adv.br
        IDENTIDADE: Consultor Jurídico Sênior da Valor Precatório (B & M Negócios Ltda).
        TOM: Técnico, seguro e resolutivo.
        REGRA: Não trabalhamos com RPV, apenas Precatórios.
        OBJETIVO: Levar o cliente para o WhatsApp (62) 99933-4004.
        """;

    public GeminiService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta").build();
        this.objectMapper = objectMapper;
        carregarRespostasProntas();
    }

    // Configura as respostas fixas aqui para economizar API
    private void carregarRespostasProntas() {
        // --- 1. PAGAMENTO ---
        String msgPagamento = """
            💰 **Sobre o Pagamento:**
            
            O pagamento é realizado **à vista**, via transferência bancária (TED ou PIX), diretamente na conta do titular do precatório.
            
            O repasse ocorre **no mesmo dia** ou em até 24h após a assinatura da Escritura Pública de Cessão de Crédito no cartório. Garantimos total segurança e transparência na operação.
            """;

        // --- 2. PRAZOS ---
        String msgPrazo = """
            ⏱️ **Prazos da Negociação:**
            
            Nossa análise jurídica leva cerca de **24 horas**. Estando tudo certo com a documentação, agendamos o cartório imediatamente.
            
            O processo completo (do envio dos dados até o dinheiro na conta) costuma levar de **3 a 5 dias úteis**.
            """;

        // --- 3. SEGURANÇA ---
        String msgSeguranca = """
            🛡️ **Segurança Jurídica:**
            
            A operação é 100% segura e regulamentada pelo Código Civil (Arts. 286 a 298).
            
            Tudo é formalizado por **Escritura Pública em Cartório de Notas**, o que dá fé pública ao negócio. Você só transfere o direito após garantirmos o pagamento.
            """;
            
        // --- 4. DOCUMENTOS ---
        String msgDocumentos = """
            📄 **Documentos Necessários:**
            
            Para a análise inicial, precisamos apenas de:
            * Número do Processo;
            * Valor de Face (aproximado);
            * CPF do Titular.
            
            Para o fechamento, solicitaremos RG/CNH, Comprovante de Residência e Dados Bancários.
            """;

        // --- 5. CONTATO ---
        String msgContato = """
            📞 **Fale Conosco:**
            
            Você pode falar diretamente com nosso especialista Dr. Sacha Begara:
            * WhatsApp: **(62) 99933-4004**
            * E-mail: contato@valorprecatorio.adv.br
            """;

        // --- 6. AVALIAÇÃO (NOVO) ---
        String msgAvaliacao = """
            💲 **Solicitar Avaliação:**
            
            Para saber quanto pagamos no seu precatório hoje, preencha o formulário **"Solicite uma Proposta"** logo acima no site, ou envie os dados do processo para nosso WhatsApp: **(62) 99933-4004**.
            
            A análise é gratuita e sem compromisso!
            """;

        // --- 7. O QUE É PRECATÓRIO (NOVO) ---
        String msgOQueE = """
            ⚖️ **O que é Precatório?**
            
            Precatório é uma ordem de pagamento expedida pela Justiça para cobrar de órgãos públicos (Município, Estado ou União) valores devidos após condenação judicial definitiva.
            
            Basicamente, é um "cheque" que o governo te deve, mas que pode demorar anos para pagar. Nós compramos esse direito para você receber o dinheiro agora.
            """;
            
        // --- 8. RPV (NOVO) ---
        String msgRPV = """
            🚫 **Sobre RPV (Pequeno Valor):**
            
            No momento, trabalhamos **exclusivamente com Precatórios**.
            
            Não realizamos a compra de RPVs (Requisições de Pequeno Valor), pois elas possuem prazo de pagamento curto (até 60 dias) e o deságio da venda não seria vantajoso para você.
            """;

        // Mapeia palavras-chave para as respostas
        faqDatabase.put("pagamento", msgPagamento);
        faqDatabase.put("receber", msgPagamento);
        faqDatabase.put("dinheiro", msgPagamento);
        
        faqDatabase.put("prazo", msgPrazo);
        faqDatabase.put("tempo", msgPrazo);
        faqDatabase.put("demora", msgPrazo);
        
        faqDatabase.put("seguro", msgSeguranca);
        faqDatabase.put("segurança", msgSeguranca);
        faqDatabase.put("golpe", msgSeguranca);
        
        faqDatabase.put("documentos", msgDocumentos);
        faqDatabase.put("preciso", msgDocumentos);
        
        faqDatabase.put("contato", msgContato);
        faqDatabase.put("telefone", msgContato);
        faqDatabase.put("whatsapp", msgContato);
        faqDatabase.put("atendente", msgContato);
        
        // Novos Mapeamentos
        faqDatabase.put("avaliação", msgAvaliacao);
        faqDatabase.put("proposta", msgAvaliacao);
        faqDatabase.put("quanto vale", msgAvaliacao);
        faqDatabase.put("cotar", msgAvaliacao);
        
        faqDatabase.put("o que é", msgOQueE);
        faqDatabase.put("significa", msgOQueE);
        
        faqDatabase.put("rpv", msgRPV);
        faqDatabase.put("pequeno valor", msgRPV);
    }

    public Flux<String> streamChat(List<Map<String, Object>> history, String currentMessage) {
        // 1. VERIFICAÇÃO LOCAL (CACHE) - Economiza API
        String perguntaNormalizada = currentMessage.toLowerCase();
        
        for (Map.Entry<String, String> entry : faqDatabase.entrySet()) {
            if (perguntaNormalizada.contains(entry.getKey())) {
                return Flux.just(entry.getValue());
            }
        }

        // 2. SE NÃO ACHOU NO FAQ, CHAMA A IA (FALLBACK)
        // Tenta 1.5 Flash primeiro, se falhar tenta 2.0 Flash
        return tryChatWithModel("gemini-1.5-flash", history, currentMessage)
                .onErrorResume(e -> {
                    System.err.println("⚠️ 1.5-Flash falhou, tentando backup... " + e.getMessage());
                    return tryChatWithModel("gemini-2.0-flash", history, currentMessage);
                })
                .onErrorResume(e -> {
                    System.err.println("🔴 Todos os modelos falharam: " + e.getMessage());
                    return Flux.just("⚠️ **Indisponibilidade:** O sistema de IA está momentaneamente sobrecarregado. Por favor, tente novamente em 1 minuto.");
                });
    }

    private Flux<String> tryChatWithModel(String modelName, List<Map<String, Object>> history, String currentMessage) {
        String cleanKey = (apiKey != null) ? apiKey.trim() : "";

        var contents = new ArrayList<>(history);
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", currentMessage))));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", contents);
        requestBody.put("system_instruction", Map.of("parts", List.of(Map.of("text", SYSTEM_INSTRUCTION))));
        requestBody.put("generationConfig", Map.of("temperature", 0.3));

        return webClient.post()
            .uri(uriBuilder -> uriBuilder
                .path("/models/" + modelName + ":streamGenerateContent")
                .queryParam("key", cleanKey)
                .build())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(requestBody)
            .retrieve()
            .bodyToFlux(String.class)
            .map(this::extractTextFromJson)
            .retryWhen(Retry.backoff(2, Duration.ofSeconds(2))
                .filter(throwable -> throwable instanceof WebClientResponseException && 
                        ((WebClientResponseException) throwable).getStatusCode().value() == 429));
    }

    private String extractTextFromJson(String jsonChunk) {
        try {
            String cleanJson = jsonChunk.trim();
            if (cleanJson.startsWith("data:")) cleanJson = cleanJson.substring(5).trim();
            if (cleanJson.startsWith(",")) cleanJson = cleanJson.substring(1).trim();
            if (cleanJson.startsWith("[")) cleanJson = cleanJson.substring(1).trim();
            if (cleanJson.endsWith("]")) cleanJson = cleanJson.substring(0, cleanJson.length() - 1).trim();
            if (cleanJson.isEmpty()) return "";

            JsonNode rootNode = objectMapper.readTree(cleanJson);
            if (rootNode.has("candidates") && rootNode.get("candidates").isArray()) {
                JsonNode candidate = rootNode.get("candidates").get(0);
                if (candidate.has("content")) {
                    JsonNode parts = candidate.get("content").get("parts");
                    if (parts.isArray() && parts.size() > 0) return parts.get(0).get("text").asText();
                }
            }
        } catch (Exception e) { return ""; }
        return "";
    }
}