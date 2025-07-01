import {
  StyleProp,
  TextInput,
  ViewStyle,
  TextInputProps,
} from 'react-native';

export const Searchbar = ({
  searchQuery,
  setSearchQuery,
  placeholder,
  placeholderTextColor,
  style,
  ...props
}: {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  style?: StyleProp<ViewStyle>;
} & TextInputProps) => {
  return (
    <TextInput
      placeholder={placeholder || 'Search...'}
      placeholderTextColor={placeholderTextColor || '#8E8E93'}
      value={searchQuery}
      onChangeText={setSearchQuery}
      style={style}
      {...props}
    />
  );
};
