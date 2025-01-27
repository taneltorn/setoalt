import React from 'react';
import {Box} from "@mantine/core";
import {Sponsor} from "../model/Sponsor.ts";

const Sponsors: Sponsor[] = [
    {
        name: "Eesti Kirjandusmuuseum",
        logoUrl: "https://pood.kirmus.ee/media/eesti-kirjandusmuuseum/EKM_logo_ET.png",
        link: ""
    },
    {
        name: "Eesti Rahvaluule Arhiiv",
        logoUrl: "https://galerii.kirmus.ee/koobas/img/image/era-logo-sin.jpg",
        link: ""
    },
    {
        name: "Eesti Teadusagentuur",
        logoUrl: "https://www.etag.ee/wp-content/uploads/2022/02/ETAG-logo-black_RGB.png",
        link: ""
    },
    {
        name: "Haridus- ja Teadusministeerium",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Haridus-_ja_Teadusministeeriumi_logo.png",
        link: ""
    },
    {
        name: "Kultuuriministeerium",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Kultuuriministeeriumi_logo.png",
        link: ""
    },
];

const Logo: React.FC = () => {

    return (
        <Box mt={"xl"}>
            {Sponsors.map((sponsor, i) =>
                <img
                    key={i}
                    title={sponsor.name}
                    height={100}
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                />)}
        </Box>);
}

export default Logo;
