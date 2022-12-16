import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import axios from 'axios';
import './signup.scss';

const Login = (props: any) => {
    const history = useNavigate();


    const validate = (values: any) => {
        const errors: any = {};

        if (!values.email) {
            errors.email = 'Required';
        } else if (values.email && !/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/gmi.test(values.email)) {
            errors.email = 'Enter valid email';
        }

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
            email: '',
            password: '',
            cnfrmpassword: ''
        },
        validate,
        onSubmit: async (values: any) => {
            try{
                const {email,password} = values;
                const res:any = await axios({
                    method: 'post',
                    url: 'http://localhost:4000/user-module/registeremail',
                    data: {
                        "EMAIL":email,
                        "PASSWORD":password
                    }
                  })
    
                console.log({
                    email,password,
                    res
                })
                const {data:{status}} = res;
                if(status === 200){
                    history('/login')
                }
            }catch(error:any){
                const {response:{data}} = error;
                let msg:any = 'Error while processing data'
                if(data && data.message){
                    msg = data.message
                }
                alert(msg)
            }

            // console.log({
            //     email, password, cnfrmpassword
            // })
        },
    });

    return (
        <div className="signup">
            <form className="container_box" onSubmit={formik.handleSubmit}>
                <div className="mail_field field">
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

                <div className="pwd_field field">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control type="password" id="password" placeholder="Enter email"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            onBlur={formik.handleBlur}
                        />
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
                            onBlur={formik.handleBlur}
                        />
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
    );
};

Login.propTypes = {

};

export default Login;