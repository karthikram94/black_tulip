import { UPDATE_USER_DETAIL } from '../actions/actionType';

const initialState = {
    name:'',
    age:0,
    gender:'',
    profile:null,
};

export default (state = Object.assign({}, initialState), { type, payload }:any) => {
    console.log({
        status:'in store',
        type,
        payload
    })
    switch (type) {
        case UPDATE_USER_DETAIL:
            return {
                ...state,
                [payload.key]:payload.value
            }
        // case UserActionType.getAdminActiveUserList:
        //     return {
        //         ...state,
        //         adminActiveUserList: payload,
        //     };
        default:
            return state;
    }
};
