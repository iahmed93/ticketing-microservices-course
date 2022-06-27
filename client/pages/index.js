import buildClient from '../api/build-client';

const LandingPage = ({currentUser}) => {
    console.log(currentUser);
};


LandingPage.getInitialProps = async (context) => {
    const {data} = await buildClient(context).get('/api/users/currentuser');
    return data;
}

export default LandingPage;