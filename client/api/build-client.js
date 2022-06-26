import axios from 'axios';

const buildClient = ({req}) => {
    if (typeof window === 'undefined'){ // on server side
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else { // on browser side
        return axios.create({
            baseURL: '/'
        });
    }
}

export default buildClient;