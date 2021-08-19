import Image from "next/image";
import Link from "next/link";

import classes from "./Home.module.scss";

const Home = (props) => {
    return (
        <section className={`${classes.home}`}>
            <div className={`container ${classes.home__container}`}>
                <div className={`${classes.home__sneaker}`}>
                    <div className={`${classes.home__shape}`}></div>
                    <img
                        src="/images/site/home/home.png"
                        alt="Yeezy"
                        className={`${classes.home__image}`}
                    />
                </div>

                <div className={`${classes.home__data}`}>
                    <h1 className={`${classes.home__title}`}>
                        YEEZY BOOST <br /> SPLY - 350
                    </h1>
                    <p className={`${classes.home__description}`}>
                        The best place to explore all brands and new collections of modern sneakers
                    </p>

                    <Link href="/products">
                        <a className={`${classes.home__link}`}>Explore now</a>
                    </Link>
                </div>
            </div>
        </section>
    );
};
export default Home;
