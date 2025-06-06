import DocumentPicker, { types } from '@react-native-documents/picker';

export async function pickMedia(pickTypes = [types.audio, types.video]) {
  try {
    // pick() returns an array of selected items
    const res = await DocumentPicker.pick({
      type: pickTypes,
    });
    return res[0]; // return the first selected file (similar to pickSingle)
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      return null; // user cancelled picker
    } else {
      throw err;
    }
  }
}
