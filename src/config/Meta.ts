import EN from '../i18n/en';
import GER from '../i18n/ger';

const loadlanguage = () => {
  return EN;
};

const metaJSON = loadlanguage();

export const metaFinder = (key: keyof typeof metaJSON): any => {
  return metaJSON[key];
};
