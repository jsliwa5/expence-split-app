package com.example.splits.infrastructure.services;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Async
    public void sendPushNotification(String targetFcmToken, String title, String body) {
        if (targetFcmToken == null || targetFcmToken.isBlank()) {
            return;
        }

        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        Message message = Message.builder()
                .setToken(targetFcmToken)
                .setNotification(notification)
                .build();

        try {
            String response = FirebaseMessaging.getInstance().send(message);
            // System.out.println("Powiadomienie wysłane: " + response);
        } catch (Exception e) {
            System.err.println("Nie udało się wysłać powiadomienia FCM: " + e.getMessage());
        }
    }
}