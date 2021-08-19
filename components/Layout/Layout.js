import Navigation from "../Header/Header";
const Layout = (props) => {
    return (
        <>
            <Navigation />
            <main>{props.children}</main>
        </>
    );
};

export default Layout;
