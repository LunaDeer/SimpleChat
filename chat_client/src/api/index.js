import requerts from "./requerts";

//登录
export const login = (data) =>requerts({url: 'login',method: 'POST',data:data});
export const register = (data) =>requerts({url: 'register',method: 'POST',data:data});

export const selectMyRelative = (params) =>requerts({url: 'api/selectMyRelative',method: 'GET',params:params});
export const selectMsg = (params) =>requerts({url: 'api/selectMsg',method: 'GET',params:params});
export const selectUnreadMsg = (params) =>requerts({url: 'api/selectUnreadMsg',method: 'GET',params:params});
export const selectUserInfo = (params) =>requerts({url: 'api/selectUserInfo',method: 'GET',params:params});
export const setMsgState = (data) =>requerts({url: 'api/setMsgState',method: 'POST',data:data});
export const setNickname = (data) =>requerts({url: 'api/setNickname',method: 'POST',data:data});
export const setSignature = (data) =>requerts({url: 'api/setSignature',method: 'POST',data:data});




export const hello = (data) =>requerts({url: 'api/hello',method: 'POST',data:data});
export const selectStationByEquipment = (params) =>requerts({url: 'api/selectStationByEquipment',method: 'GET',params:params});

