import Layout from "@/components/Layout/Layout";
import "../sass/index.scss";

const App = ({ Component, pageProps }) => {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

export default App;
