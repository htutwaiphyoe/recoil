import classes from "./BrandItem.module.scss";
import Link from "next/link";
const BrandItem = ({ title, description, image }) => {
    return (
        <div className={`${classes.brandItem}`}>
            <div className={`${classes.brandItem__data}`}>
                <h3 className={`${classes.brandItem__title}`}>{title}</h3>
                <p className={`${classes.brandItem__description}`}>{description}</p>
                <Link href="/">
                    <a className={`${classes.brandItem__link}`}>
                        Buy now
                        <i className={`${classes.brandItem__link__icon} uil uil-arrow-right`}></i>
                    </a>
                </Link>
            </div>

            <img
                src={`/images/site/brand/${image}`}
                alt={title}
                className={`${classes.brandItem__image}`}
            />
        </div>
    );
};

export default BrandItem;
