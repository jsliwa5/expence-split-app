import storage from '@react-native-firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';

export async function uploadReceiptAndGetUrl(localImageUri: string): Promise<string | null> {
  try {
    // 1. Compress image
    const compressedImage = await ImageManipulator.manipulateAsync(
      localImageUri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );

    // 2. Generate unique path
    const fileName = `receipts/receipt-${Date.now()}.jpg`;
    const reference = storage().ref(fileName);

    // 3. Upload to Firebase
    await reference.putFile(compressedImage.uri);

    // 4. Get download URL
    const downloadUrl = await reference.getDownloadURL();
    return downloadUrl;

  } catch (error) {
    console.error('Failed to upload receipt to Firebase:', error);
    return null;
  }
}
