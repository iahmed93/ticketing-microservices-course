import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent =  ({Component, pageProps, currentUser}) => {
    return <div>
        <Header currentUser={currentUser}/>
        <Component {...pageProps} />
    </div> 
}

AppComponent.getInitialProps = async ({Component, ctx}) => {
    let pageProps = {}
    const {data} = await buildClient(ctx).get('/api/users/currentuser');
    if (Component.getInitialProps){
        pageProps = await Component.getInitialProps(ctx);
    }
    return {
        pageProps,
        ...data
    };
}

export default AppComponent;