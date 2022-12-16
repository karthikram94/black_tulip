import React, { useState,useRef, useEffect,useCallback } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaUserEdit } from "react-icons/fa";
import { useFormik } from 'formik';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { updateUserDetails } from '../../redux/actions/userAct';
import './users.scss';

const Users = (props: any) => {
    const usrselector:any = useSelector((state:any) => state.userStore);
    const dispatch:any = useDispatch();
    const navigate:any = useNavigate();
    const [inpfileref,setInpFileRef]:any = useState();
    const [pim,setpim]:any = useState();
    let localStorageData:any = localStorage.getItem('tokenData');
    localStorageData = jwt_decode(localStorageData);


    const validate = (values: any) => {
        const errors: any = {};
        if (!values.name) {
            errors.name = 'Required';
        } else if (values.name && values.name.length < 3) {
            errors.email = 'Enter valid name';
        }

        if (!values.age) {
            errors.age = 'Required';
        } else if (values.age) {
            const ages = Number(values.age)
            if (ages < 20) {
                errors.age = 'Age not below 20';
            } else if (ages > 80) {
                errors.age = 'Age not above 80';
            }
        }

        if (!values.gender) {
            errors.gender = 'Required';
        }

        return errors;
    };

    
    const formik: any = useFormik({
        initialValues: {
            name:usrselector.name,
            age:usrselector.age,
            gender:usrselector.gender
        },
        validate,
        onSubmit: async (values: any) => {
            const { name, age, gender } = values;
            try{
                const fd = new FormData();
                fd.append('NAME',name);
                fd.append('AGE',age);
                fd.append('GENDER',gender);
                // const fils:any = inpfileref.target
                
                    const b64toBlob = (dataURI:any)  => {
                        var byteString = atob(dataURI.split(',')[1]);
                        var ab = new ArrayBuffer(byteString.length);
                        var ia = new Uint8Array(ab);
                        
                        for (var i = 0; i < byteString.length; i++) {
                            ia[i] = byteString.charCodeAt(i);
                        }
                        return new Blob([ab], { type: 'image/jpeg' });
                    }
                if(usrselector.profile){
                    let b64:any = usrselector.profile.replace(/url\((.*)\)/gmi,'$1')
                    const blobdata = b64toBlob(b64)
                    fd.append('profile',blobdata);
                }

                const res:any = await axios({
                    method: 'post',
                    url: 'http://localhost:4000/user-module/updateuserdetails',
                    data: fd,
                    headers:{
                        authorization:'Bearer '+localStorage.getItem('tokenData')
                    }
                  })
    
                const {data:{status}}:any = res;

                if(status === 200){
                    alert('User data saved successfully')
                    localStorage.removeItem('reduxStoreValue')
                }
            }catch(error:any){
                const {response:{data}} = error;
                let msg:any = 'Error while processing data'
                if(data && data.message){
                    msg = data.message
                }
                if(data.status === 403 || data.status === 401){
                    localStorage.removeItem('tokenData')
                    navigate('/login')
                }
                alert(msg)
            }

        },
    });

    useEffect(() => {
        if(pim){
            if(usrselector.profile){
                pim.style.background = usrselector.profile
            }else{
                pim.style.background = ''
            }
        }
    },[usrselector.profile,pim])

    useEffect(() => {
        initialUserCall();
    },[]);

    const initialUserCall = useCallback(async() => {
        let localStorageReduxData:any = localStorage.getItem('reduxStoreValue')
        if(!localStorageReduxData){
            try{
                const res:any = await axios({
                    method: 'get',
                    url: `http://localhost:4000/user-module/getuser/${localStorageData.data.id}`,
                    headers:{
                        authorization:'Bearer '+localStorage.getItem('tokenData')
                    }
                  })
    
                const {data:{data}}:any = res;
    
                if(data.length){
                    const [{
                        PROFILE,
                        NAME,
                        AGE,
                        GENDER
                    }] = data;
                    if(PROFILE){
    
                        const arrayBufferToBase64 = (buffer:any) => {
                            var binary = '';
                            var bytes = new Uint8Array( buffer );
                            var len = bytes.byteLength;
                            for (var i = 0; i < len; i++) {
                                binary += String.fromCharCode( bytes[ i ] );
                            }
                            return window.btoa( binary );
                        }
                        var base64String =  'data:image/gif;base64,'+arrayBufferToBase64(PROFILE.data);
                        updateUsrReduxValue('profile',`url(${base64String})`)
                    }
    
                    formik.setValues({
                        name:NAME,
                        age:AGE,
                        gender:GENDER
                    })
                }
            }catch(error:any){
                const {response:{data}} = error;
                let msg:any = 'Error while processing data'
                if(data && data.message){
                    msg = data.message
                }
                alert(msg)
            }
        }
    },[])







    const updateUsrReduxValue = (key:any,value:any) => {
        dispatch(updateUserDetails({key,value}))
    }

    const savedraft = () =>{
        const lsvalues:any = {
            userStore:{
                ...usrselector
            }
        }
        localStorage.setItem('reduxStoreValue',JSON.stringify(lsvalues))
        alert('Draft data saved successfully')
    }

    return (
        <>
            <div className="users">
                <form className="container_box" onSubmit={formik.handleSubmit}>
                    <div className="profile_img" id="profile_img" ref={(re:any) => setpim(re)}>
                        <input type="file" id='profileimg' name='profileimg' style={{display:'none'}} 
                        ref={(re:any) => setInpFileRef(re)}
                        onChange={(eve:any) => {
                            const file = eve.target.files[0];
                            var reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = function () {
                              const imgbg:any =  window.document.getElementById('profile_img');
                              if(imgbg){
                                  updateUsrReduxValue('profile',`url(${reader.result})`)
                              }
                            };
                            reader.onerror = function (error) {
                              console.log('Error: ', error);
                            };
                        }}
                           />
                        <FaUserEdit style={{
                            fontSize: '30px',
                            padding: '2px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            position: 'absolute',
                            bottom: '22px',
                            color: 'deepskyblue'
                        }} 
                        onClick={() => {
                            if(inpfileref){
                                inpfileref.click()
                            }
                        }}
                        />
                    </div>
                    <div className="mail_field">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label htmlFor="emailid">Email address</Form.Label>
                            <Form.Control type="email" id="emailid" disabled={true} 
                            value={localStorageData.data.EMAIL}/>
                        </Form.Group>
                    </div>

                    <div className="name_field">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control type="text" id="name" placeholder="Enter Name"
                                onChange={(e:any) => {
                                    updateUsrReduxValue('name',e.target.value)
                                    formik.handleChange(e)}}
                                value={formik.values.name}
                                onBlur={formik.handleBlur}
                            />
                            <span className='error_span'>
                                {formik.errors.name ? formik.errors.name : null}
                            </span>
                        </Form.Group>
                    </div>

                    <div className="age_field">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label htmlFor="age">Age</Form.Label>
                            <Form.Control type="number" id="age" name="age" placeholder="Enter email"
                                onChange={(e:any) => {
                                    updateUsrReduxValue('age',e.target.value)
                                    formik.handleChange(e)}}
                                value={formik.values.age}
                                onBlur={formik.handleBlur}
                            />
                            <span className='error_span'>
                                {formik.errors.age ? formik.errors.age : null}
                            </span>
                        </Form.Group>
                    </div>

                    <div className="gender_field">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label htmlFor="gender">Gender</Form.Label>
                            <Form.Select id="gender" name="gender" aria-label="Default select example"
                                onChange={(e:any) => {
                                    updateUsrReduxValue('gender',e.target.value)
                                    formik.handleChange(e)
                                }}
                                value={formik.values.gender}
                                onBlur={formik.handleBlur}
                            >
                                <option value={""}>Open this select menu</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Others</option>
                            </Form.Select>
                            <span className='error_span'>
                                {formik.errors.gender ? formik.errors.gender : null}
                            </span>
                        </Form.Group>
                    </div>

                    <div className="btns">
                        <Button variant="primary" type="button" onClick={savedraft}>Save draft</Button>
                        <Button variant="primary" type="submit">Save</Button>
                    </div>

                </form>
            </div>


        </>
    );
};

Users.propTypes = {

};

export default Users;