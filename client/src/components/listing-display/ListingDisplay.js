import React from "react";
import Header from "../header/Header";
import "./Listing.global.css";
import { useQuery, gql, useMutation } from "@apollo/client";
import NoImage from './NoImage.png';

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
            <div className="listingPicture">
                <img src={NoImage} className='specificImage'/>
                {
                    // <img src={data.pictures}></img> {/* this will need to map from pics -> imgs */}
                }
                
            </div>
            <div className="listingInfo">
                <div className="listingTitle">
                    {data.item.title}
                </div>
                <div className="listingItemInfo">
                    {data.item.year}  | {data.item.version}
                </div>
                <div className="listingAuthor">
                    by {data.item.author} 
                </div>
                
                <div className="listingCourses"> 
                    {data.item.courses[0].subject} {data.item.courses[0].courseNum} {/* this will need to map from courses -> buttons/tags */}
                </div>
                <div className="listingSellInfo">
                    <div className="listingPrice">
                        ${data.price}
                
                    </div>
                    <div classname="listingContact">
                        Contact Seller
                        {/* contact seller/pdf/etc flexible button here */}
                    </div>
                </div>
                
            </div>
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
            <div className="listingsContainer">
                {data['listingReadMany'].map(listing => {
                    return (<Listing data={listing} />);
                })}
            </div>
        </div>
    )
}

export default ListingDisplay;