import React from "react";
import Header from "../header/Header";
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
        <div className="flex flex-row justify-start w-100 h-1/4 border rounded-lg m-3 px-5 py-6 leading-normal">
            <div className="flex h-100 w-1/5">
                <img src={data.pictures.length > 0 ? data.pictures[0] : NoImage} className='flex h-100 w-11/12'/>                
            </div>
            <div className="flex flex-col w-4/5 pl-1">
                <div className="flex text-primary-black text-xl font-semibold">
                    {data.item.title}
                </div>
                <div className="flex flex-col text-secondary-teal">
                    {data.item.year}  | {data.item.version}
                </div>
                <div className="flex text-gray-500 mb-3">
                    by {data.item.author} 
                </div>
                
                <div className="flex w-max text-primary-purple bg-primary-purple bg-opacity-10 px-3 border border-primary-purple rounded-lg"> 
                    {data.item.courses[0].subject} {data.item.courses[0].courseNum}  {/* this will need to map from courses -> buttons/tags AND change color by course code (wait for filtering)*/}
                </div>
                <div className="flex flex-row justify-between mt-5">
                    <div className="flex text-primary-black text-3xl">
                        ${data.price}
                    </div>
                    <div className="flex w-1/3 h-7/12 bg-primary-teal rounded-full text-white justify-center items-center text-sm">
                        Contact Seller
                        {/* contact seller/pdf/etc flexible button here */}
                    </div>
                </div>
            </div>
            
            <div className="pr-2">
                <svg class="h-6 w-6 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
            </div>
        </div>
    )
}

const GET_LISTINGS = gql`
    query GetListings {
        listingReadMany {
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
        <div className="flex flex-col self-center w-100">
            <Header />
            <div className="w-2/5 self-center">
                {data['listingReadMany'].map(listing => {
                    return (<Listing data={listing} />);
                })}
            </div>
        </div>
    )
}

export default ListingDisplay;