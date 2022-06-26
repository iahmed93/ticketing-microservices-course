import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [errors, setErrors] = useState([]);
    const {doRequest, errors} = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: { email, password },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = async (event) => {
        event.preventDefault();

        console.log(email, password);

        // try {
        //     const response = await axios.post('/api/users/signup', {
        //         email, password
        //     });
    
        //     console.log(response.data);
        // } catch (error) {
        //     console.log(error.response.data);
        //     setErrors(error.response.data.errors)
        // }

        doRequest();
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            {/* { errors.length > 0 && (
                    <div className="alert alert-danger">
                        <ul>
                            {errors.map(err => <li key={err.message}>{err.message}</li>)}
                        </ul>
                    </div>
                )
            } */}
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
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )

}

export default SignUp;