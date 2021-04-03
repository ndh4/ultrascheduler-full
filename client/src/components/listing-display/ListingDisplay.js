import React from "react";
import Header from "../header/Header";
import "./Listing.global.css";
import { useQuery, gql, useMutation } from "@apollo/client";
import NoImage from './NoImage.png';
import Filter from '../filtering/Filter'

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
    console.log(data);
    return (
        <div className="listingContainer">
        </div>
    )
}

const GET_LISTINGS = gql`
    query GetListings {
        listingFindMany {
            item {
                _id
                courses {
                    _id
                    subject
                    courseNum
                }
                title
                year
                author
                version
            }
            seller
            condition
            price
            availability
            pictures
        }
    }
    `

const ListingDisplay = () => {
    const { data, error } = useQuery(GET_LISTINGS);
    console.log(data);
    if (!data) {
        console.log(error);
        return <h1>Waiting...</h1>
    }
    return (
        <div className="listingDisplayContainer">
            <Header />
            <Filter classname="w-1/2"/>
            {/* <div className="listingsContainer">
                {data['listingReadMany'].map(listing => {
                    return (<Listing data={listing} />);
                })}
            </div> */}
        </div>
    )
}

export default ListingDisplay;