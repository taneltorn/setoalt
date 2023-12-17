import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {NavLink} from "@mantine/core";
import classes from "./SideBar.module.scss";
import {GiGClef} from "react-icons/gi";
import {PiSpeakerSimpleHigh} from "react-icons/pi";
import {IoHome} from "react-icons/io5";

const structure = [
    {id: 'home', icon: <IoHome className={classes.icon} size={24}/>, link: "/"},
    {id: 'scores', icon: <PiSpeakerSimpleHigh className={classes.icon} size={24}/>, link: "/scores"},
    {id: 'editor', icon: <GiGClef className={classes.icon} size={24}/>, link: "/editor"},
];

const Navbar: React.FC = () => {

    const [t] = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className={classes.navbar}>
            {structure.map((item, index) => (
                <NavLink
                    key={index}
                    active={item.link === "/" && location.pathname === "/" || item.link !== "/" && location.pathname.startsWith(item.link)}
                    className={classes.link}
                    label={t(`navbar.${item.id}`)}
                    leftSection={item.icon}
                    onClick={() => navigate(item.link)}
                />
            ))}
        </div>
    );
}

export default Navbar;
