import classes from "./Featured.module.scss";
import FeaturedItem from "./FeaturedItem/FeaturedItem";
const Featured = (props) => {
    const items = [
        { image: "featured4.png", name: "Nike Jordan Red", price: 149.99 },
        { image: "featured8.png", name: "Nike Jordan Black", price: 149.99 },
        { image: "featured5.png", name: "Nike Jordan Blue", price: 149.99 },
    ];
    return (
        <section className={`section`}>
            <h2 className={`section__title`}>Featured</h2>

            <div className={`${classes.featured__container} container grid`}>
                {items.map((item, i) => (
                    <FeaturedItem key={i} {...item} />
                ))}
            </div>
        </section>
    );
};

export default Featured;
