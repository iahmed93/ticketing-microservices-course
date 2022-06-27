import { useState } from "react";
import axios from 'axios';

const useRequest = ({url, method, body, onSuccess}) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            const response = await axios[method](url, body);
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (error) {
            // console.log(error)
            setErrors(
                <div className="alert alert-danger">
                    <ul>
                        {error.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
                    </ul>
                </div>
            )
        }
    }
    
    return {doRequest, errors}
}

export default useRequest;