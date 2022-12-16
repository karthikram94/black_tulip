import React, { useState, useEffect } from 'react';
import Login from './login';
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = (props:any) => {
    const history = useNavigate()

    useEffect(() => {
        let localStorageData:any = localStorage.getItem('tokenData');

        if(!localStorageData){
            history('/login')
        }else{
            localStorageData = jwt_decode(localStorageData)
            console.log({
                localStorageData,
                acc:props.userAccess
            })
            if(
                !localStorageData.data || 
                !localStorageData.data.USERROLEId ||  
                localStorageData.data.USERROLEId !== props.userAccess
            ){
                history('/login')
            }
        }
    },[props]);

    return props.loader      
};

ProtectedRoute.propTypes = {
    loader:React.Component,
    userAccess:Number
};

export default ProtectedRoute;