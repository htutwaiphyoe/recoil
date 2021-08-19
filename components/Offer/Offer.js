import classes from "./Offer.module.scss";
import Link from "next/link";

const Offer = (props) => {
    return (
        <section className={`section`}>
            <div className={`${classes.offer__container} container grid`}>
                <div className={`${classes.offer__data}`}>
                    <h3 className={`${classes.offer__title}`}>50% OFF</h3>
                    <p className={`${classes.offer__description}`}>In Addidas super sale</p>

                    <Link href="/products">
                        <a className={`${classes.offer__link}`}>Shop now</a>
                    </Link>
                </div>

                <img
                    src="/images/site/offer/offer.png"
                    alt="Addidas"
                    className={`${classes.offer__image}`}
                />
            </div>
        </section>
    );
};

export default Offer;
