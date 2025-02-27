'use client'

import * as React from "react";

import {Box, Card, CardContent, CardMedia} from "@mui/material";
import {useEffect} from "react";

const TimeCard = () => {
    const [time, setTime] = React.useState("00:00:00");

    useEffect(() => {
        const timer = setInterval(() => {
            let date_ob = new Date();
            let hours: any = date_ob.getHours();
            let minutes: any = date_ob.getMinutes();
            let seconds: any = date_ob.getSeconds();

            if (hours < 10) {
                hours = "0" + date_ob.getHours();
            }
            if (minutes < 10) {
                minutes = "0" + date_ob.getMinutes();
            }
            if (seconds < 10) {
                seconds = "0" + date_ob.getSeconds();
            }

            setTime(hours + ":" + minutes + ":" + seconds);
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div>
            <Card
                sx={{
                    display: "flex",
                    minHeight: 100
                }}
            >
                <CardMedia
                    component="img"
                    sx={{
                        width: 100,
                        height: 100,
                        marginBottom: 1.5,
                        marginTop: 1.5,
                        marginLeft: 1.5
                    }}
                    image={"/clock.svg"}
                    alt="Clock Icon"
                />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}
                >
                    <CardContent style={{width: 100}}>
                        <h1 style={{textAlign: "center", marginTop: 5}}>{time}</h1>
                    </CardContent>
                </Box>
            </Card>
        </div>
    );
}

export default TimeCard;