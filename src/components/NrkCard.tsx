'use client'

import React, {useEffect, useState} from "react";

import {
    Card,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    LinearProgress,
    Typography
} from "@mui/material";


const NrkCard = () => {
    const articelCount = 10;
    const feed = "https://www.nrk.no/toppsaker.rss";

    const [news, setNews] = useState<any[]>([]);
    const [currentNews, setCurrentNews] = React.useState(0);
    const [progress, setProgress] = React.useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    setCurrentNews((current) => {
                        if (current >= articelCount - 1) {
                            return 0;
                        }

                        return current + 1;
                    });
                    return 0;
                }
                const diff = 4;
                return oldProgress + diff;
            });
        }, 400);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        function getNews() {
            const newsArray: any[] = [];

            fetch(feed)
                .then((response) => response.text())
                .then((str) => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(str, "text/xml");

                    const XMLParser = require("react-xml-parser");
                    const NewXml = new XMLParser().parseFromString(
                        new XMLSerializer().serializeToString(xmlDoc.documentElement)
                    );

                    NewXml.children[0].children.forEach((data: any) => {
                        if (data.name == "item") {
                            const title = data.children.find(
                                (o: any) => o.name === "title"
                            ).value;
                            const description = data.children.find(
                                (o: any) => o.name === "description"
                            ).value;
                            const image = data.children.find(
                                (o: any) => o.name === "media:content"
                            )?.attributes.url;
                            const category = data.children.find(
                                (o: any) => o.name === "category"
                            )?.value;
                            const link = data.children.find(
                                (o: any) => o.name === "link"
                            ).value;
                            newsArray.push({title, description, image, category, link});
                        }
                    });
                    setNews(newsArray);
                });
        }

        getNews();

        const timer = setInterval(() => {
            getNews();
        }, 60 * 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    if (news === null) {
        return (
            <div>
                <CircularProgress/>
            </div>
        );
    } else {
        return (
            <div>
                <Card>
                    {news[currentNews]?.image != undefined ? (
                        <CardMedia
                            sx={{width: 450}}
                            image={news[currentNews]?.image}
                            title="News Header Image"
                        />
                    ) : (
                        <CardMedia
                            sx={{height: 450}}
                            image={"nrk-logo.jpg"}
                            title="News Header Image"
                        />
                    )}

                    <CardContent>
                        <Typography color="text.secondary">Nyheter fra NRK</Typography>
                        <a
                            href={news[currentNews]?.link}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <Typography gutterBottom variant="h5" component="div">
                                {news[currentNews]?.title}
                            </Typography>
                        </a>
                        {news[currentNews]?.category != undefined && (
                            <Chip
                                label={news[currentNews]?.category}
                                color="primary"
                                variant="outlined"
                            />
                        )}

                        <div className="mt-3"></div>
                        <Typography variant="body2" color="text.secondary">
                            {news[currentNews]?.description}
                        </Typography>
                        <br></br>
                        <LinearProgress variant="determinate" value={progress}/>
                    </CardContent>
                </Card>
            </div>
        );
    }
}


export default NrkCard;