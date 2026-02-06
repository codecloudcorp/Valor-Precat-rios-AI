package com.valorprecatorio.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    // ADICIONE ESTE BEAN PARA CORRIGIR O ERRO
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}