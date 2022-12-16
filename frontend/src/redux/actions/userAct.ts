import { UPDATE_USER_DETAIL } from './actionType';

export const updateUserDetails = ({key,value}:any) => (dispatch:any, getState:any) => {
  // console.log({
  //   statuss:'updateUserDetails',
  //   key,value
  // })
  dispatch({
    type:UPDATE_USER_DETAIL,
    payload:{
      key,value
    }
  })
};
