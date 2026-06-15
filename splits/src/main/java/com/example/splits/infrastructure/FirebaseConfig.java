package com.example.splits.infrastructure;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            // 1. Sprawdzamy, czy aplikacja działa w chmurze Render
            File renderSecretFile = new File("/etc/secrets/firebase-service-account.json");
            InputStream serviceAccount;

            if (renderSecretFile.exists()) {
                // Środowisko produkcyjne (Render)
                serviceAccount = new FileInputStream(renderSecretFile);
                System.out.println("☁️ Wczytano plik konfiguracyjny Firebase z chmury Render.");
            } else {
                // Środowisko lokalne (Twój komputer)
                serviceAccount = new FileInputStream("com/example/splits/firebase-service-account.json");
                System.out.println("💻 Wczytano lokalny plik konfiguracyjny Firebase.");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("🚀 Firebase został pomyślnie zainicjalizowany!");
            }
        } catch (IOException e) {
            System.err.println("❌ Błąd podczas inicjalizacji Firebase: " + e.getMessage());
        }
    }
}