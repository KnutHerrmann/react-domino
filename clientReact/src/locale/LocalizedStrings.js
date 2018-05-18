import moment from 'moment';

/**
 * Simple module to localize the React interface using the same syntax
 * used in the ReactNativeLocalization module
 * (https://github.com/stefalda/ReactNativeLocalization)
 *
 * Originally developed by Stefano Falda (stefano.falda@gmail.com)
 *
 * It uses a call to the Navigator/Browser object to get the current interface language,
 * then display the correct language strings or the default language (the first
 * one if a match is not found).
 *
 * How to use:
 * Check the instructions at:
 * https://github.com/stefalda/react-localization
 */
export default class LocalizedStrings {

    static _getBestMatchingLanguage(language, props) {
        //If an object with the passed language key exists return it
        if (props[language]) return language;
        //if the string is composed try to find a match with only the first language identifiers (en-US --> en)
        const idx = language.indexOf('-');
        if (idx >= 0) {
            language = language.substring(0, idx);
            if (props[language]) return language;
        }
        //Return the default language (the first coded)
        return Object.keys(props)[0];
    }

    constructor(props) {
        this.interfaceLanguage = (typeof navigator !== 'undefined' && navigator.languages && typeof navigator.languages !== 'undefined' && navigator.languages[0] && typeof navigator.languages[0] !== 'undefined') ? navigator.languages[0] : ((typeof navigator !== 'undefined' && navigator.language && typeof navigator.language !== 'undefined') ? navigator.language : ((typeof navigator !== 'undefined' && navigator.userLanguage && typeof navigator.userLanguage !== 'undefined') ? navigator.userLanguage : 'en-US'));
        //Store locally the passed Strings
        this.props = props;
        this.defaultLanguage = Object.keys(props)[0];
        //Set language to its default value (the interface)
        this.setLanguage(this.interfaceLanguage);
    }

    //Can be used from ouside the class to force a particular language
    //independently from the interface one
    setLanguage(language) {
        //Check if a translation exists for the current language or if the default
        //should be used
        const bestLanguage = LocalizedStrings._getBestMatchingLanguage(language, this.props);
        this.language = bestLanguage;
        //Associate the language object to the this object
        if (this.props[bestLanguage]) {
            //console.log("There are Strings for the language:"+language);
            //Merge default
            const localizedStrings = {...this.props[this.defaultLanguage], ...this.props[this.language]};
            for (let key in localizedStrings) {
                //console.log("Checking property:"+key);
                if (localizedStrings.hasOwnProperty(key)) {
                    //console.log("Associating property:"+key);
                    this[key] = localizedStrings[key];
                }
            }
        }
    }

    //The current language displayed (could differ from the interface language
    // if it has been forced manually and a matching translation has been found)
    getLanguage() {
        return this.language;
    }

    //The current interface language (could differ from the language displayed)
    getInterfaceLanguage() {
        return this.interfaceLanguage;
    }

    //Return an array containing the available languages passed as props in the constructor
    getAvailableLanguages() {
        if (!this.availableLanguages) {
            this.availableLanguages = [];
            for (let language in this.props) {
                if (language) {
                    this.availableLanguages.push(language);
                }
            }
        }
        return this.availableLanguages;
    }

    //Format the passed string replacing the numbered placeholders
    //i.e. I'd like some {0} and {1}, or just {0}
    //Use example:
    //  Strings.formatString(Strings.question, Strings.bread, Strings.butter)
    formatString(str, ...values) {
        let res = str;
        for (let i = 0; i < values.length; i++) {
            res = LocalizedStrings._replaceAll('{' + i + '}', values[i], res);
        }
        return res;
    }

    //Return a string with the passed key in a different language
    getString(key, language) {
        try {
            return this.props[language][key];
        } catch (ex) {
            console.log('No localization found for key ' + key + ' and language ' + language);
        }
        return null;
    }

    //Replace all occorrencies of a string in another using RegExp
    static _replaceAll(find, replace, str) {
        //Escape find
        // eslint-disable-next-line
        find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        return str.replace(new RegExp(find, 'g'), replace);
    }

    getCurrency(number, currency) {
        return number.toLocaleString(this.getLanguage(), {
            style: 'currency',
            currency: currency || 'EUR'
        });
    }

    getDate(date) {
        moment.locale(this.getLanguage());
        return moment(date).format('LL');
    }

    getTime(time) {
        moment.locale(this.getLanguage());
        return moment(time).format('LT');
    }

    getDateTime(date) {
        moment.locale(this.getLanguage());
        return moment(date).format('LL LT');
    }

    getWeekday(date) {
        moment.locale(this.getLanguage());
        return moment(date).format('dddd');
    }

    getFromNow(date) {
        moment.locale(this.getLanguage());
        return moment(date).fromNow();
    }

}