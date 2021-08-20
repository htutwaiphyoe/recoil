import classes from "./Collection.module.scss";
import CollectionItem from "./CollectionItem/CollectionItem";
const Collection = (props) => {
    const items = [
        { title: "Nike", description: "New collection 2021", image: "collection1.png" },
        { title: "Addidas", description: "New collection 2021", image: "collection2.png" },
    ];
    return (
        <section className={`section`}>
            <h2 className={`section__title`}>Collections</h2>

            <div className={`${classes.collection__container} container grid`}>
                {items.map((item, i) => (
                    <CollectionItem key={i} {...item} />
                ))}
            </div>
        </section>
    );
};

export default Collection;
