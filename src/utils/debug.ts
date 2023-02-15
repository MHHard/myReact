import _ from 'lodash';
import { storageConstants } from '../constants/const';

export class debugTools {
    static input(params: string, type: string) {
        const debug = localStorage.getItem(storageConstants.KEY_DEBUG);
        if(!debug || debug === 'close') return null;
        let res;
        // eslint-disable-next-line no-alert
        const value = window.prompt(params);
        if(!value) return null;
        switch(type) {
            case 'Array':
                res = _.compact(value.slice(1, value.length-1).split(','));
                break;
            case 'Number':
                res = Number(value);
                break;
            default:
                res = value;
                break;
        }
        return res;
    }
}