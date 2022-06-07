import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';

const ImagePickerUtil = (
  callback: Function,
  options: CameraOptions | ImageLibraryOptions,
) => {
  return new Promise<ImagePickerResponse>((resolve, reject) => {
    callback(options, (response: ImagePickerResponse) => {
      if (response.errorCode || response.errorMessage) {
        reject(new Error(response.errorCode || response.errorMessage));
      } else {
        if (response.didCancel) {
          reject(new Error('User did cancel'));
        } else {
          resolve(response);
        }
      }
    });
  });
};

export default ImagePickerUtil;
