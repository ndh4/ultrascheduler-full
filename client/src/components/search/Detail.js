import React, { Fragment, useState } from "react";
import { Table, TableBody, TableRow, TableCell, Box } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";


const Detail = ({
    course, //course is multiple sessions or used for instructorQuery 
    session, //session is within course; used for courseQuery 
    // instructorsToNames,
    // open,
    // classTimeString,
}) => {
    return (

        <p>{course === undefined ? session.crn : course.longTitle}</p>

    );
};


export default Detail;
