import React,{useEffect} from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useLocation,useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import './forgotpassword.scss';

const ForgotPassword = (props: any) => {
    const location: any = useLocation();
    const navigate:any = useNavigate();
    const params = new URLSearchParams(location.search);
    const token:any = params.get('token');
    useEffect(() => {
        const tData:any = jwt_decode(token)
        console.log({
            tData
        })
        if(!tData || !tData.data || !tData.data.id){
            navigate('/login')
        }
    },[])

    const validate = (values: any) => {
        const errors: any = {};

        if (!values.password) {
            errors.password = 'Required';
        } else if (values.password && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/gmi.test(values.password)) {
            errors.password = 'Password must contain Upper case and lower case and numeric and special character';
        }

        if (!values.cnfrmpassword) {
            errors.cnfrmpassword = 'Required';
        } else if (values.cnfrmpassword && values.cnfrmpassword !== values.password) {
            errors.cnfrmpassword = 'Password and confirm password must be same';
        }

        return errors;
    };

    const formik: any = useFormik({
        initialValues: {
            password: '',
            cnfrmpassword: ''
        },
        validate,
        onSubmit: async (values: any) => {
            const { password, cnfrmpassword } = values;
            try{
                const tData:any = jwt_decode(token)
                const res:any = await axios({
                    method: 'post',
                    url: 'http://localhost:4000/user-module/updatepasswordbylink',
                    data: {
                        id:tData.data.id,
                        PASSWORD:password
                    }
                  })
    
                const {data:{status}} = res;
                if(status === 200){
                    alert('Successfully reset password')
                    navigate('/login')
                }
            }catch(error:any){
                console.log({
                    error
                })
                const {response:{data}} = error;
                let msg:any = 'Error while processing data'
                if(data && data.message){
                    msg = data.message
                }
                alert(msg)
            }

            console.log({
                password, cnfrmpassword
            })
        },
    });

    return (
        <>
            <div className="forgotpassword">
                <form className="container_box" onSubmit={formik.handleSubmit}>
                    <div className="pwd_field field">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label htmlFor="password">Password</Form.Label>
                            <Form.Control type="password" id="password" name="password" placeholder="Enter email"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                onBlur={formik.handleBlur} />
                            <span className='error_span'>
                                {formik.errors.password ? formik.errors.password : null}
                            </span>
                        </Form.Group>
                    </div>

                    <div className="cnfrm_pwd_field field">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label htmlFor="cnfrmpassword">Confirm Password</Form.Label>
                            <Form.Control type="password" id="cnfrmpassword" name="cnfrmpassword" placeholder="Enter email"
                                onChange={formik.handleChange}
                                value={formik.values.cnfrmpassword}
                                onBlur={formik.handleBlur} />
                            <span className='error_span'>
                                {formik.errors.cnfrmpassword ? formik.errors.cnfrmpassword : null}
                            </span>
                        </Form.Group>
                    </div>

                    <div className="btns">
                        <Button variant="primary" type="submit">Register</Button>
                    </div>

                </form>
            </div>
        </>
    );
};

ForgotPassword.propTypes = {

};

export default ForgotPassword;