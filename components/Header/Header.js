import Link from "next/link";
import { useEffect, useRef } from "react";

import classes from "./Header.module.scss";

const Navigation = (props) => {
    const headerRef = useRef();
    useEffect(() => {
        if (headerRef.current) {
            window.document.addEventListener("scroll", () => {
                if (window.scrollY > 100) headerRef.current.classList.add("header-scroll");
                else headerRef.current.classList.remove("header-scroll");
            });
        }
    }, []);
    return (
        <header className={`${classes.header}`} ref={headerRef}>
            <nav className={`${classes.header__nav} container`}>
                <div className={`${classes.header__toggle}`}>
                    <i className="uil uil-apps"></i>
                </div>

                <Link href="/">
                    <a className={`${classes.header__logo}`}>SneakerHub</a>
                </Link>

                <div className={`${classes.header__menu}`}>
                    <ul className={`${classes.header__list}`}>
                        <li className={`${classes.header__item}`}>
                            <Link href="/">
                                <a className={`${classes.header__link}`}>Home</a>
                            </Link>
                        </li>
                        <li className={`${classes.header__item}`}>
                            <Link href="/">
                                <a className={`${classes.header__link}`}>Products</a>
                            </Link>
                        </li>
                        <li className={`${classes.header__item}`}>
                            <Link href="/">
                                <a className={`${classes.header__link}`}>Contact</a>
                            </Link>
                        </li>
                        <li className={`${classes.header__item}`}>
                            <Link href="/">
                                <a className={`${classes.header__link}`}>Login</a>
                            </Link>
                        </li>
                    </ul>
                </div>

                <Link href="/">
                    <a className={`${classes.header__icon}`}>
                        <i className="uil uil-shopping-cart"></i>
                    </a>
                </Link>
            </nav>
        </header>
    );
};

export default Navigation;
