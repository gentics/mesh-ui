import { id, noop } from '../../../common/util/util';

export class MockI18nNotification {
    show = noop;
    rxError = id;
    rxSuccess = () => id;
    promiseSuccess = () => id;
    destroyAllToasts = noop;
}
