import { createStore, applyMiddleware } from "redux";
import { reducers } from "../redux/reducer";
import thunk from "redux-thunk";
import logger from "redux-logger";

let localStorageData:any = localStorage.getItem('reduxStoreValue')

if(localStorageData){
    localStorageData = JSON.parse(localStorageData)
}
console.log({
    localStorageData
})

export const store = createStore(reducers,{
    ...(localStorageData || {})
}, applyMiddleware(thunk,logger));


// import { createStore, applyMiddleware } from "redux";
// import { reducers } from "../redux/reducer";
// import thunk from "redux-thunk";
// import logger from "redux-logger";
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'

// // export const store = createStore(reducers, applyMiddleware(thunk,logger));
// const persistConfig = {
//     key: 'root',
//     storage,
//   }
   
//   const persistedReducer = persistReducer(persistConfig, reducers)
   
//   export default () => {
//     let store = createStore(persistedReducer,applyMiddleware(thunk,logger))
//     let persistor = persistStore(store)
//     return { store, persistor }
//   }

