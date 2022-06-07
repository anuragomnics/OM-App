import React, {FC} from 'react';
// custom
import Select from '../../../components/Select';
import Constants from '../../../config/Constants';

interface Props {
  options: Array<{id: number; name: string}>;
  value: string | undefined;
  placeholder: string;
  onSelect: (value: string) => void;
  error: string | undefined;
  touched?: boolean;
}

const TitleSelector: FC<Props> = ({
  options,
  value,
  placeholder,
  onSelect,
  touched,
  error,
}) => {
  return (
    <Select
      options={options}
      value={value}
      placeholder={placeholder}
      onSelect={onSelect}
      error={error}
      touched={touched}
    />
  );
};

export default TitleSelector;
