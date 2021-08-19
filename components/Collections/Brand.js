import classes from "./Brand.module.scss";
import BrandItem from "./BrandItem/BrandItem";
const Brand = (props) => {
    const items = [
        { title: "Nike", description: "New Brand 2021", image: "brand1.png" },
        { title: "Addidas", description: "New Brand 2021", image: "brand2.png" },
    ];
    return (
        <section className={`section`}>
            <h2 className={`section__title`}>Brands</h2>

            <div className={`${classes.brand__container} container grid`}>
                {items.map((item, i) => (
                    <BrandItem key={i} {...item} />
                ))}
            </div>
        </section>
    );
};

export default Brand;
