import Home from "@/components/Home/Home";
import Featured from "@/components/Featured/Featured";
import Collection from "@/components/Collections/Brand";
import Offer from "@/components/Offer/Offer";

const HomePage = (props) => {
    return (
        <>
            <Home />
            <Featured />
            <Collection />
            <Offer />
        </>
    );
};
export default HomePage;
