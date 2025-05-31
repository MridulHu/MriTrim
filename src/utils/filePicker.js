import DocumentPicker from 'react-native-document-picker';

export async function pickMedia(types = [DocumentPicker.types.audio, DocumentPicker.types.video]) {
  try {
    const res = await DocumentPicker.pickSingle({
      type: types,
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
