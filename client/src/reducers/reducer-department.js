import _ from 'lodash';

import { FETCH_DEPARTMENTS } from './../actions/department';

export default function(state = null, action) {
    switch(action.type) {
        case FETCH_DEPARTMENTS:
            return _.mapKeys(action.payload.data.data, "_id");
        default:
            return {...state};
    }
}