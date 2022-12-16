import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { useFormik } from 'formik';
import axios from 'axios';
import './login.scss';

const Login = (props: any) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const history = useNavigate();

    const signupfn = () => {
        history('/signup')
    }

    const validate = (values:any) => {
        const errors:any = {};
      
        if (!values.email) {
          errors.email = 'Required';
        }else if(values.email && !/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/gmi.test(values.email)){
         errors.email = 'Enter valid email';
        }
    
        if (!values.password) {
          errors.password = 'Required';
        }else if(values.password && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/gmi.test(values.password)){
            errors.password = 'Password must contain Upper case and lower case and numeric and special character';
        }
    
        return errors;
      };

    const formik: any = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate,
        onSubmit:async (values:any) => {
            try{
                const {email,password} = values;
                const res:any = await axios({
                    method: 'post',
                    url: 'http://127.0.0.1:4000/user-module/signupuser',
                    data: {
                        "EMAIL":email,
                        "PASSWORD":password
                    }
                  })
    
                const {data:{data,status,token}} = res; 
                if(status && status === 200){
                    localStorage.setItem('tokenData',token)
                    if(data.USERROLEId === 2){
                        history('/user')
                    }else if(data.USERROLEId === 1){
                        history('/admin')
                    }
                }
            }catch(error:any){
                const {response:{data}} = error;
                let msg:any = 'Error while processing data'
                if(data && data.message){
                    msg = data.message
                }
                alert(msg)
            }

        },
    });


    const modalvalidate = (values:any) => {
        const errors:any = {};
      
        if (!values.email) {
          errors.email = 'Required';
        }else if(values.email && !/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/gmi.test(values.email)){
         errors.email = 'Enter valid email';
        }
    
        return errors;
    }


    const modalformik = useFormik({
        initialValues: {
            email: '',
        },
        validate:modalvalidate,
        onSubmit:async (values:any) => {
            const {email} = values;
            try{
                const res:any = await axios({
                    method: 'post',
                    url: 'http://localhost:4000/user-module/sendpasswordlink',
                    data: {
                        "EMAIL":email,
                    }
                  })
    
                const {data:{accepted}} = res;
                if(accepted && accepted.length){
                    alert('Email send successfully');
                    handleClose();
                }
            }catch(error:any){
                const {response:{data}} = error;
                let msg:any = 'Error while processing data'
                if(data && data.message){
                    msg = data.message
                }
                alert(msg)
            }

            console.log({
                email
            })
        },
    });


    return (
        <>
            <div className="login">
                <form className="container_box" onSubmit={formik.handleSubmit}>
                    <div className="mail_field">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label htmlFor="email">Email address</Form.Label>
                            <Form.Control type="email" id="email" name="email" placeholder="Enter email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                onBlur={formik.handleBlur}
                            />
                            <span className='error_span'>
                            {formik.errors.email ? formik.errors.email : null}
                            </span>
                        </Form.Group>
                    </div>

                    <div className="pwd_field">
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label htmlFor="password">Password</Form.Label>
                            <Form.Control type="password" id="password" name="password" placeholder="Enter password"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                            />
                            <span className='error_span'>
                            {formik.errors.password ? formik.errors.password : null}
                            </span>
                        </Form.Group>
                    </div>

                    <div className="btns">
                        <Button variant="primary" type="submit">Sign in</Button>{' '}
                        <Button variant="primary"
                            type="button"
                            onClick={signupfn}>Sign up</Button>
                    </div>

                    <div className="fgpwd d-flex justify-content-center align-items-center">
                        <a onClick={() => setShow(true)}>forgot password</a>
                    </div>

                </form>
            </div>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                    <form onSubmit={modalformik.handleSubmit}>
                <Modal.Body>
                    <div className="pwd_field">
                        <Form.Group controlId="formBasicPwdLink">
                            <Form.Control type="email" id="email" name="email" placeholder="Enter email" 
                                onChange={modalformik.handleChange}
                                value={modalformik.values.email}
                                onBlur={modalformik.handleBlur}
                            />
                            <span style={{color: 'red',fontSize: '.8rem'}}>
                            {modalformik.errors.email ? modalformik.errors.email : null}
                            </span>
                        </Form.Group>
                    </div>
                    <span>send a password reset link to the user's email address</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">Proceed</Button>
                </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};

Login.propTypes = {

};

export default Login;