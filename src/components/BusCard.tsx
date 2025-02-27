'use client'

import moment from "moment";
import "moment-timezone";
import "moment/locale/nb";
import React, {useEffect, useState} from "react";

moment.locale("nb");

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from "@mui/material";


const BusCard = () => {
    const [busData, setBusData] = useState<any[]>([]);

    const kristianIvsGate = "NSR:StopPlace:24888"

    useEffect(() => {
        const fetchBusdata = async () => {
            try {
                const response = await fetch(
                    "https://api.entur.io/journey-planner/v3/graphql",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            query: `{
                      stopPlace(id: "${kristianIvsGate}") {
                        description
                        name
                        estimatedCalls(numberOfDepartures: 10) {
                          actualArrivalTime
                          actualDepartureTime
                          date
                          realtime
                          destinationDisplay {
                              frontText
                          }
                          expectedDepartureTime
                          serviceJourney {
                            line {
                              name
                              publicCode
                            }
                          }
                        }
                      }
                    }
                    `
                        })
                    }
                );
                const enturJSON = await response.json();
                const data = enturJSON.data.stopPlace;
                const departures = data.estimatedCalls;

                setBusData(departures);
            } catch (err) {
                console.log(err);
            }
        };
        fetchBusdata();

        const timer = setInterval(fetchBusdata, 1000 * 60);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableBody>
                    {busData &&
                        busData.map((data, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    sx={{"&:last-child td, &:last-child th": {border: 0}}}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{fontSize: 32}}
                                    >
                                        {data.realtime == false && "ca "}
                                        {moment(data.expectedDepartureTime).diff(
                                            moment(),
                                            "seconds"
                                        ) <= 60 && "Nå"}
                                        {moment(data.expectedDepartureTime).diff(
                                                moment(),
                                                "seconds"
                                            ) > 60 &&
                                            moment(data.expectedDepartureTime).diff(
                                                moment(),
                                                "seconds"
                                            ) <
                                            60 * 10 &&
                                            moment(data.expectedDepartureTime).diff(
                                                moment(),
                                                "minutes"
                                            ) + " min"}
                                        {moment(data.expectedDepartureTime).diff(
                                                moment(),
                                                "seconds"
                                            ) >=
                                            60 * 10 &&
                                            moment(data.expectedDepartureTime).format("LT")}
                                    </TableCell>
                                    <TableCell align="left" sx={{fontSize: 32}}>
                                        {data.serviceJourney.line.publicCode}{" "}
                                        {data.destinationDisplay.frontText}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default BusCard;