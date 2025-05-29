import DocumentPicker from 'react-native-document-picker';

export async function pickMedia(type = [DocumentPicker.types.audio, DocumentPicker.types.video]) {
  try {
    const res = await DocumentPicker.pickSingle({
      type,
    });
    return res;
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      return null;
    } else {
      throw err;
    }
  }
}
