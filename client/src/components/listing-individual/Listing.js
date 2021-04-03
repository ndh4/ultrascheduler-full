import React from "react";
import Header from "../header/Header";
import { useQuery, gql, useMutation } from "@apollo/client";
import NoImage from "./NoImage.png";

const defaultTextbookImage = "https://textbook-images.s3.amazonaws.com/discrete_math.jpg";

const Listing = () => {
    return (
        <div>
            <Header />
            <div className="flex flex-row w-full">
                <div className="flex flex-col w-1/2 items-center justify-center my-10">
                    <div className="flex flex-row w-full justify-center items-center py-10">
                        <svg className="w-9 h-9 mr-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
                        <img className="w-1/2" src={defaultTextbookImage}></img>
                        <svg className="w-9 h-9 ml-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex flex-row w-full justify-center space-x-8 py-5">
                        <img className="w-12" src={defaultTextbookImage}></img> {/* map from images */}
                        <img className="w-12" src={defaultTextbookImage}></img>
                        <img className="w-12" src={defaultTextbookImage}></img>
                    </div>
                </div>
                <div className="flex flex-col w-1/3 items-left my-10 pl-5">
                    <div className="flex flex-col items-left pt-10 pb-5">
                        <div className="flex w-max text-primary-purple bg-primary-purple bg-opacity-10 px-3 border border-primary-purple rounded-lg">
                            {/*{data.item.courses[0].subject} {data.item.courses[0].courseNum}*/}
                            COMP 182
                        </div>
                        <div className="flex text-primary-black text-3xl font-semibold leading-snug">
                            {/*{data.item.title}*/}
                            Discrete Math and Its Applications
                            <br></br>
                            {/*{data.item.year}  | {data.item.version}*/}
                            (Second Edition)
                        </div>
                        <div className="flex text-primary-black text-3xl leading-normal">
                            {/*${data.price}*/}
                            $60
                        </div>
                        <div className="flex text-primary-black leading-normal">
                            Textbook | Hardcopy
                        </div>
                        <div className="flex text-green-500 leading-normal text-lg">
                            Available
                        </div>
                        <div className="flex flex-row space-x-5 mt-5 items-center">
                            <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                            </svg>
                            <div className="flex text-primary-black text-xl">
                                Seller Name
                            </div>
                        </div>
                        <div className="flex flex-row space-x-5 mt-5 items-center">
                            <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                            </svg>
                            <div className="flex text-primary-black text-xl">
                                On Campus Pickup
                            </div>
                        </div>
                        <div className="flex text-base text-primary-black mt-5 pr-10">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                        <div className="w-full h-0.5 bg-gray-300 mt-6"></div>
                    </div>
                    <div className="border flex flex-col items-center">
                        <div className="border flex text-primary-black text-xl font-semibold">
                            Contact Seller
                        </div>
                        <div className="border flex flex-row w-1/2 space-x-6 items">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center rounded-full bg-primary-teal w-9 h-9">
                                    <svg className="text-white w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex text-primary-black text-sm">
                                        Email
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center rounded-full bg-primary-teal w-9 h-9">
                                    <svg className="text-white w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex text-primary-black text-sm">
                                        Messenger
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center rounded-full bg-primary-teal w-9 h-9">
                                    <svg className="text-white w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <div className="flex text-primary-black text-sm">
                                        iMessage
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Listing;