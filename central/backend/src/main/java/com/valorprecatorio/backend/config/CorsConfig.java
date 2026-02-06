package com.valorprecatorio.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // 1. Origens permitidas (Localhost para testes + Seus domínios de produção)
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000", 
            "https://valorprecatorio.adv.br", 
            "https://valor-precatorios-ai.vercel.app"
        ));
        
        // 2. Métodos e Headers permitidos
        config.addAllowedMethod("*"); // GET, POST, OPTIONS, etc.
        config.addAllowedHeader("*"); // Content-Type, Authorization, etc.
        
        // 3. Credenciais (opcional - deixe comentado se não usar cookies/sessão)
        // config.setAllowCredentials(true);

        // 4. Aplica a configuração a todas as rotas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}