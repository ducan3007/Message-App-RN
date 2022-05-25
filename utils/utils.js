import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { ToastAndroid } from "react-native";

export const getRandomHexString = (size) => {
  let result = [];
  let hexRef = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", ];

  for (let n = 0; n < size; n++) {
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  }
  return result.join("");
};

export const dowloadFileAsync = async (imgURI,success) => {
  try {
     
    const file = getRandomHexString(16);
    const { uri } = await FileSystem.downloadAsync(
      imgURI,
      FileSystem.documentDirectory + `${file}.jpg`
    );
    const asset = await MediaLibrary.createAssetAsync(uri);
    const album = await MediaLibrary.getAlbumAsync('Download');
    if (album == null) {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
    await FileSystem.deleteAsync(uri);
    ToastAndroid.show('Download Successfully',ToastAndroid.LONG)

  } catch (error) {
    ToastAndroid.show('Download Failed',ToastAndroid.LONG);
  }
};
