import messaging from '@react-native-firebase/messaging';
import { registerFCMToken } from '../api/auth';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Set up how foreground notifications are handled
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

export async function setupFCM() {
  try {
    // Request permissions for Expo Notifications explicitly (critical for Android 13+)
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    // 1. Request permission for Firebase messaging
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled && finalStatus === 'granted') {
      // 2. Get the token
      const fcmToken = await messaging().getToken();
      console.log('Firebase FCM Token:', fcmToken);

      // 3. Send it to the backend
      await registerFCMToken(fcmToken);
      console.log('FCM Token registered with backend');
    } else {
      console.log('FCM or Expo permission denied');
    }
  } catch (error) {
    console.error('Failed to setup FCM:', error);
  }
}

// Foreground handler
messaging().onMessage(async remoteMessage => {
  console.log('Message handled in the foreground!', remoteMessage);
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: remoteMessage.notification?.title || 'Nowe Powiadomienie',
      body: remoteMessage.notification?.body || '',
      data: remoteMessage.data,
      sound: true,
    },
    trigger: {
      seconds: 1,
      channelId: 'default',
    },
  });
});

// Background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});
