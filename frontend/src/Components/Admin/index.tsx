import axios from 'axios';
import react, { useState, useEffect, useCallback } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import './admin.scss';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [users, setUsers]: any = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        initialApiCall();
    }, []);

    const initialApiCall = useCallback(async () => {
        try {
            const res: any = await axios({
                method: 'get',
                url: `http://localhost:4000/user-module`,
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('tokenData')
                }
            })

            const { data: { data } } = res;

            console.log({
                data
            })

            setUsers(data)

        } catch (error: any) {
            const { response: { data } } = error;
            let msg: any = 'Error while processing data'
            if (data && data.message) {
                msg = data.message
            }
            alert(msg)
        }
    }, [])

    const changeUserStatus = async(tIndex:number,user:any,event:any) => {
        const statuschangevalue:any = event.target.value
        console.log({
            user,value:statuschangevalue
        })

        try {
            const res: any = await axios({
                method: 'post',
                url: `http://localhost:4000/user-module/updateuserstatus`,
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem('tokenData')
                },
                data:{
                    id:user.id,
                    STATUS:statuschangevalue
                }
            })

            console.log({
                res
            })
            const { data: { status } } = res;
            console.log({
                status
            })
            if(status === 200){
                setUsers((p:any) => {
                    const pre:any = [...p];
                    pre[tIndex].STATUS = statuschangevalue
                    console.log({
                        pre,
                        tIndex,
                        vals:statuschangevalue
                    })
                    return pre
                })
            }
        } catch (error: any) {
            const { response: { data } } = error;
            console.log({
                data
            })
            let msg: any = 'Error while processing data'
            if (data && data.message) {
                msg = data.message
            }
            if(data.status === 403 || data.status === 401){
                localStorage.removeItem('tokenData')
                navigate('/login')
            }
            alert(msg)
        }
    }

    console.log({
        users
    })
    return (
        <>
            <div className="admin">
                <div className="table_container">
                    <Table striped>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (users || []).map((usr: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{usr.NAME}</td>
                                            <td>{usr.EMAIL}</td>
                                            <td>
                                            <Form.Select id="gender" name="gender" aria-label="Default select example"
                                            value={usr.STATUS}
                                            onChange={(e:any) => changeUserStatus(index,usr,e)}
                            >
                                <option value="pending">Pending</option>
                                <option value="submitted">Submitted</option>
                                <option value="verified">Verified</option>
                            </Form.Select>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}

export default Admin