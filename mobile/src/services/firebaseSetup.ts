import messaging from '@react-native-firebase/messaging';
import { registerFCMToken } from '../api/auth';
import { Platform } from 'react-native';

export async function setupFCM() {
  try {
    // 1. Request permission (required for iOS, optional but good practice for Android 13+)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // 2. Get the token
      const fcmToken = await messaging().getToken();
      console.log('Firebase FCM Token:', fcmToken);

      // 3. Send it to the backend
      await registerFCMToken(fcmToken);
      console.log('FCM Token registered with backend');
    } else {
      console.log('FCM permission denied');
    }
  } catch (error) {
    console.error('Failed to setup FCM:', error);
  }
}

// Background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});
