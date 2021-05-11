import React, { useState } from "react";
import Header from "../header/Header";
import { useQuery, gql, useMutation } from "@apollo/client";
import NoImage from "./NoImage.png";
import { useLocation } from "react-router";

const defaultTextbookImageArray = [
    "https://images-na.ssl-images-amazon.com/images/I/51Wo9pTgBFL._SX402_BO1,204,203,200_.jpg",
    "https://www.mheducation.com/cover-images/Jpeg_400-high/125967651X.jpeg",
    "https://images-na.ssl-images-amazon.com/images/I/5102AwbnX7L._SX374_BO1,204,203,200_.jpg"
]; /* to be replaced w/ imgs pulled from backend */

const ListingPage = ({ listing }) => {
    const [getImageURLIndex, setImageURLIndex] = useState(0);

    const location = useLocation();

    console.log(location.state.seller)

    console.log(location.state);

    const GET_SELLER = gql`
        query GetSeller($id: MongoID!) {
            sellerOne(filter: {_id: $id}){
                netid
                phone
                firstName
                lastName
            }
        }
    `


    const { data: seller_data, loading, error } = useQuery(GET_SELLER, {
        variables: { id: location.state.seller },
    })

    if (loading) {
        console.log(error);
        return <h1>Waiting...</h1>
    }

    if (error) {
        return <h1>{error}</h1>
    }

    if (!seller_data) {
        return <h1>No data!</h1>
    }

    let seller = seller_data.sellerOne

    const ListingImage = ({ data, idx }) => {
        return (
            <img class="rounded w-12 h-12 transform transition duration-500 hover:scale-110" onClick={() => setImageURLIndex({ idx })} src={data} ></ img>
        )
    }

    const ListingCourse = ({ data, idx }) => {
        return (
            <div class="flex w-max text-primary-purple bg-primary-purple bg-opacity-10 text-sm px-3 mb-2 border-2 border-primary-purple rounded-lg">
                {location.state.item.courses[idx].subject} {location.state.item.courses[idx].courseNum}
            </div>
        )
    }

    const FBMessengerButton = () => {
        if (seller.fbUser) {
            return (
                <div class="w-1/3 flex flex-col items-center" href="">
                    <a href={"facebook.com/" + seller.fbUser + "/"} class="transform transition hover:bg-blue-500 duration-500 flex items-center justify-center rounded-full bg-primary-teal w-9 h-9 mb-1"> {/* takes FB username from backend */}
                        <svg class="text-white w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-width="0" d="M7.764 19.225c.59-.26 1.25-.309 1.868-.139c.77.21 1.565.316 2.368.314c4.585 0 8-3.287 8-7.7S16.585 4 12 4s-8 3.287-8 7.7c0 2.27.896 4.272 2.466 5.676a2.8 2.8 0 0 1 .942 2.006l.356-.157zM12 2c5.634 0 10 4.127 10 9.7c0 5.573-4.366 9.7-10 9.7a10.894 10.894 0 0 1-2.895-.384a.8.8 0 0 0-.534.039l-1.984.876a.8.8 0 0 1-1.123-.707l-.055-1.78a.797.797 0 0 0-.268-.57C3.195 17.135 2 14.617 2 11.7C2 6.127 6.367 2 12 2zM5.995 14.537l2.937-4.66a1.5 1.5 0 0 1 2.17-.4l2.336 1.75a.6.6 0 0 0 .723 0l3.155-2.396c.421-.319.971.185.689.633l-2.937 4.66a1.5 1.5 0 0 1-2.17.4l-2.336-1.75a.6.6 0 0 0-.723 0l-3.155 2.395c-.421.319-.971-.185-.689-.633z" />
                        </svg>
                    </a>
                    <div class="flex text-primary-black text-sm">
                        Messenger
                    </div>
                </div>
            )
        }
        else {
            return (null);
        }
    }

    const MessageButton = () => {
        if (seller.phone) {
            return (
                <div class="flex w-1/3 flex-col items-center" href="">
                    <a href={"imessage://" + seller.phone} class="transform transition hover:bg-blue-500 duration-500 flex items-center justify-center rounded-full bg-primary-teal w-9 h-9 mb-1"> {/* not sure about this one, phone #? */}
                        <svg class="text-white w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </a>
                    <div class="flex text-primary-black text-sm">
                        iMessage
                    </div>
                </div>
            )
        }
        else {
            return (null);
        }
    }

    let pickup = "";

    if (location.state.pickup[0] == 'On_Campus') {
        pickup = "On Campus Pickup"
    }
    else if (location.state.pickup[0] == 'Shipped') {
        pickup = "Delivery"
    }
    else if (location.state.pickup[0] == 'Near_Campus') {
        pickup = "On Campus Pickup"
    }
    else {
        pickup = "No pickup method specified"
    }

    return (
        <div>
            <Header />
            <div class="flex flex-col md:flex-row w-full items-center justify-center">
                <div class="flex flex-col w-full md:w-1/2 items-center justify-center md:my-10">
                    <div class="flex flex-row w-full justify-center items-center pt-10">
                        <svg class="w-9 h-9 mr-8 text-gray-500 transition duration-500 hover:text-gray-400"
                            onClick={() => {
                                if ((getImageURLIndex - 1) > -1) {
                                    setImageURLIndex(getImageURLIndex - 1);
                                }
                                else {
                                    setImageURLIndex(location.state.pictures.length - 1);
                                }
                            }
                            } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        <img class="w-1/2" src={location.state.pictures[getImageURLIndex]}></img>
                        <svg class="w-9 h-9 ml-8 text-gray-500 transition duration-500 hover:text-gray-400"
                            onClick={() => {
                                if ((getImageURLIndex + 1) <= (location.state.pictures.length - 1)) {
                                    setImageURLIndex(getImageURLIndex + 1);
                                }
                                else {
                                    setImageURLIndex(0);
                                }
                            }
                            } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="flex flex-row w-full justify-center space-x-8 pt-6">
                        {location.state.pictures.map((picture, index) => {
                            return (
                                <ListingImage data={picture} idx={index} />
                            )
                        })}
                    </div>
                </div>
                <div class="flex flex-col w-4/5 md:w-2/5 items-center md:items-left my-10 pl-5">
                    <div class="flex flex-col items-left pt-10 pb-5">
                        {location.state.item.courses.map((course, index) => {
                            return (
                                <ListingCourse data={course} idx={index} />
                            )
                        })}
                        <div class="flex text-primary-black text-3xl font-semibold leading-snug">
                            {location.state.item.title}
                        </div>
                        <div class="flex text-primary-black text-2xl font-semibold leading-snug">
                            Year: {location.state.item.year}  | Edition: {location.state.item.version}
                        </div>
                        <div class="flex text-primary-black text-3xl leading-normal">
                            ${location.state.price} {location.state.negotiable ? null : "OBO"}
                        </div>
                        <div class="flex text-primary-black leading-normal">
                            {location.state.item.type} | {location.state.condition}
                        </div>
                        <div class="flex text-green-500 leading-normal text-lg">
                            {location.state.availability}
                        </div>
                        <div class="flex flex-row space-x-5 mt-5 items-center">
                            <svg class="h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                            </svg>
                            <div class="flex text-primary-black text-xl">
                                {seller.firstName} {seller.lastName}
                            </div>
                        </div>
                        <div class="flex flex-row space-x-5 mt-5 items-center">
                            <svg class="h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                            </svg>
                            <div class="flex text-primary-black text-xl">
                                {pickup}
                            </div>
                        </div>
                        <div class="flextext-base text-primary-black mt-5 pr-10">
                            {(!location.state.description) ? "No description given." : location.state.description}
                        </div>
                        <div class="h-0.5 bg-gray-300 mt-6"></div>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="flex text-primary-black text-xl font-semibold my-4">
                            Contact Seller
                        </div>
                        <div class="flex flex-row w-full space-x-10 justify-center items-center">
                            <FBMessengerButton />
                            <div class="w-1/3 flex flex-col justify-center items-center">
                                <a href={"mailto:" + seller.netid + "@rice.edu"} class="transform transition hover:bg-blue-500 duration-500 flex items-center justify-center rounded-full bg-primary-teal w-9 h-9 mb-1"> {/* takes seller email from backend */}
                                    <svg class="text-white w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </a>
                                <div class="flex text-primary-black text-sm">
                                    Email
                                </div>
                            </div>
                            <MessageButton />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
};

export default ListingPage;