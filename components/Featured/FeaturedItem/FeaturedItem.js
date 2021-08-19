import Image from "next/image";
import Link from "next/link";
import classes from "./FeaturedItem.module.scss";
const Featured = ({ name, image, price }) => {
    return (
        <article className={`${classes.featuredItem}`}>
            <div className={`${classes.featuredItem__sale}`}>Sale</div>
            <img
                src={`/images/site/featured/${image}`}
                alt={name}
                className={`${classes.featuredItem__image}`}
                width={250}
                height={170}
            />
            <h3 className={`${classes.featuredItem__name}`}>{name}</h3>
            <span className={`${classes.featuredItem__price}`}>${price}</span>

            <Link href="/">
                <a className={`${classes.featuredItem__link}`}>
                    Add to cart
                    <i className={`${classes.featuredItem__link__icon} uil uil-arrow-right`}></i>
                </a>
            </Link>
        </article>
    );
};

export default Featured;
