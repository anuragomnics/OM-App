import {useState} from 'react';
import {
  useActionSheet,
  ActionSheetOptions,
} from '@expo/react-native-action-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Alert, Keyboard} from 'react-native';

export const useBottomAction = () => {
  const {showActionSheetWithOptions} = useActionSheet();
  const {bottom} = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  return {
    showBottomSheet: (
      props: ActionSheetOptions,
      callback: (i: number) => void,
      cancelCallBack?: () => void,
    ) => {
      Keyboard.dismiss();
      showActionSheetWithOptions(
        {
          ...props,
          options: [...props.options, 'Cancel'],
          cancelButtonIndex: props.options.length,
          destructiveButtonIndex: props.options.length,
          containerStyle: {
            paddingBottom: bottom,
          },
          // @ts-ignore
          textStyle: {},
          // @ts-ignore
          initialIndex: activeIndex >= 0 ? activeIndex : props.initialIndex,
        },
        index => {
          if (index === props.options.length) {
            cancelCallBack?.();
            return;
          }
          // @ts-ignore
          if (props.initialIndex >= 0) {
            setActiveIndex(index);
          }
          callback(index);
        },
      );
    },
  };
};
