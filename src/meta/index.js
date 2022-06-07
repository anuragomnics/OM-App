import EN from '../i18n/en';
import GER from '../i18n/ger';

const loadLanguageMeta = ()=> {
    return EN;
}
const metaJSON = loadLanguageMeta();

export const metaFinder = (key) => {
        return metaJSON[key] || key
}
