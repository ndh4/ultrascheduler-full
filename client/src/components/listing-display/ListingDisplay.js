import React from "react";
import Header from "../header/Header";
import "./Listing.global.css";
import { useQuery, gql, useMutation } from "@apollo/client";

const dummyObject = {
    "_id": "604d1c78661c7616db93d208",
    "item": {
        "title": "Discrete Mathematics and Its Applications",
        "courses": [
            {
            "subject": "COMP",
            "courseNum": 182,
            "longTitle": "ALGORITHMIC THINKING"
            }
        ]
        },
    "price": 60,
    "condition": "NEW",
    "availability": "AVAILABLE",
    "seller": {
        "firstName": "Will"
        }
}

const Listing = ({ data }) => {
    return (
        <div className="listingContainer">
            <div className="listingPicture">
                {
                    // <img src={data.pictures}></img> {/* this will need to map from pics -> imgs */}
                }
                
            </div>
            <div className="listingInfo">
                <div className="listingItemInfo">
                    {data.item.title}
                    {data.item.year} | {data.item.version}
                    by {data.item.author}
                </div>
                <div className="listingCourses"> 
                    {data.item.courses[0].subject} {data.item.courses[0].courseNum} {/* this will need to map from courses -> buttons/tags */}
                </div>
                <div className="listingPrice">
                   ${data.price}
                   {/* contact seller/pdf/etc flexible button here */}
                </div>
            </div>
        </div>
    )
}

const GET_LISTINGS = gql`
    query listingReadMany {
        item
        seller
        condition
        price
        availability
        pictures
    }
    `

const ListingDisplay = () => {
    return (
        <div className="listingDisplayContainer">
            <Header />
            <div className="listingsContainer">
                <Listing data={dummyObject} />
            </div>
            <div className="listingsContainer">
                <Listing data={dummyObject} />
            </div>
        </div>
    )
}

export default ListingDisplay;