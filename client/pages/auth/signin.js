import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: { email, password },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = async (event) => {
        event.preventDefault();
        doRequest();
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            {errors}
            <div className="form-group">
                <label>Email</label>
                <input 
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="form-control"/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" 
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="form-control"/>
            </div>
            <button className="btn btn-primary">Sign In</button>
        </form>
    )

}

export default SignIn;