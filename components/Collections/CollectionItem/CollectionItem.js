import classes from "./CollectionItem.module.scss";
import Link from "next/link";
import Image from "next/image";
const CollectionItem = ({ title, description, image }) => {
    return (
        <div className={`${classes.collectionItem}`}>
            <div className={`${classes.collectionItem__data}`}>
                <h3 className={`${classes.collectionItem__title}`}>{title}</h3>
                <p className={`${classes.collectionItem__description}`}>{description}</p>
                <Link href="/">
                    <a className={`${classes.collectionItem__link}`}>
                        Buy now
                        <i
                            className={`${classes.collectionItem__link__icon} uil uil-arrow-right`}
                        ></i>
                    </a>
                </Link>
            </div>

            <img
                src={`/images/site/collection/${image}`}
                alt={title}
                className={`${classes.collectionItem__image}`}
            />
        </div>
    );
};

export default CollectionItem;
