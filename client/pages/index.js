import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {
    console.log(currentUser);
};


LandingPage.getInitialProps = async (context) => {
    // if (typeof window === 'undefined'){ // on server side
    //     const response = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
    //         headers: req.headers
    //     });
    //     return response.data;
    // } else { // on browser side
    //     const response = await axios.get('/api/users/currentuser');
    //     return response.data;
    // }
    // return {}
    const {data} = await buildClient(context).get('/api/users/currentuser');
    return data;
}

export default LandingPage;