import React from "react"
import { useForm } from "react-hook-form";
import './Form.css'

// NEED TO FINISH THIS AND DO THE PROPS FOR CATEGORY AND TYPE
{/* <FormRow3 label="Category*" placeholder="e.g. abc123@rice.edu" id="email" /> */}

//component for email, phone, book title, link to source, and asking price
// const FormRow2 = ({ label, placeholder, id, paragraph = false }) => {
//     return (
//         <div className="flex flex-row gap-7">
//             <label class="font-serif" className="w-1/6" htmlFor={id}>{label}</label>
//             { paragraph == true ? (
//             <textarea className={`w-2/6 appearance-none block bg-green-100 text-grey-darker border rounded px-4 mb-3`} rows={5} type="text" id={id} name={id} placeholder={placeholder} />
//             ) : (<input className={`w-2/6 appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3`} type="text" id={id} name={id} placeholder={placeholder} />)}
//         </div>
//     )
// }

const ParagraphElem = ({ id, placeholder }) => <textarea className={`flex-grow w-2/6 appearance-none block bg-green-100 text-grey-darker border rounded px-4 mb-3 mr-5`} rows={5} type="text" id={id} name={id} placeholder={placeholder} />
const InputElem = ({ id, placeholder }) => <input className={`flex-grow w-2/6 appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3 ml-5`} type="text" id={id} name={id} placeholder={placeholder} />

const NameContainer = ({ label, id}) => {
    return (
        <div className="flex flex-row gap-7">
            <label class="font-serif" className="w-1/6" htmlFor={id}>{label}</label>
            <div className="flex flex-row flex-grow justify-between">
                <InputElem placeholder= "First Name"/>
                <InputElem placeholder="Last Name"/><br></br>
            </div>
        </div>
    )
}

// containerone for the skeleton of email, phone, find a class/prep, book title, link to source
const ContainerOne = (props) => {
    const { label, placeholder, id, paragraph = false } = props;
    return (
        <div className="flex flex-row gap-7">
            <label class="font-serif" className="w-1/6" htmlFor={id}>{label}</label>
            { paragraph == true ? (
            <ParagraphElem {...props} />
            ) : (<InputElem {...props}  />)}
        </div>
    )
}

const FormRow2 = ({ label, placeholder, id, paragraph = false }) => {
    return (
        <div className="flex flex-row gap-7">
            <label class="font-serif" className="w-1/6" htmlFor={id}>{label}</label>
            { paragraph == true ? (
            <textarea className={`flex-grow w-2/6 appearance-none block bg-green-100 text-grey-darker border rounded px-4 mb-3`} rows={5} type="text" id={id} name={id} placeholder={placeholder} />
            ) : (<input className={`flex-grow w-2/6 appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3`} type="text" id={id} name={id} placeholder={placeholder} />)}
        </div>
    )
}

//component for category and tpye 
// const FormRow3 = ({ id, label, catType1, catType2, catType3, catType4 }) => {
//     return(
//         <div className= "flex flex-row gap-10">
//             <label class="font-serif" className="w-1/6" htmlFor= {id}> {label} </label>
//             <input type="radio" id= {catType1} />
//             <label htmlFor= {id}> {catType1} </label>
//             <input type="radio" id= {catType2} />
//             <label htmlFor= {id}> {catType2} </label>
//             <input type="radio" id= {catType3} />
//             <label htmlFor= {id}> {catType3} </label>
//             <input type="radio" id= {catType4} />
//             <label htmlFor= {id}> {catType4} </label>
//         </div>
//     )
// }

/**
 * id: "category"
 * label: "Category*"
 * categories: ["Course", "Standardized Test", "Other"]
 * categories: ["Digital", "Hardcopy", "etc", "etc2"]
 * 
 * <FormRow3 id="category" label="Category*" categories={["Course", "Std Test", "Other"]} />
 */

const FormRow3 = ({ id, label, categories }) => {
    return (
        <div className="flex flex-row gap-10">
            <label class="font-serif" className="w-1/6" htmlFor={id}> {label} </label>
            {categories.map(catType => {
                return (
                    <React.Fragment>
                        <input type="radio" id={catType} />
                        <label htmlFor={id}> {catType}</label>
                    </React.Fragment>
                )
            })}
        </div>
    )
}

function Form(){
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        console.log("Hello!");
        console.log(data);
    }
  
    // console.log(watch("exampleRequired"));

    return(
    // container for the whole page is the div below
     <div className="width-100%">   
        {/* container for everything except the title */}
        <div className="text-green-500 text-4xl text-center p-10"> 
        <h1 className="font-sans">New Listing</h1>
        </div>
       
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-5/6 flex flex-col flex-wrap mx-20 mr-20 overflow-hidden align-center text-lg text-green-500"> 

            {/* flex flex-row creates a row that has a certain x-axis dimension and then
            for each component in the row, we can assign a certain percent of the row for 
            it to take up */}
            {/* <div className="flex flex-row gap-7">
            <label className=" w-1/6 " htmlFor="yname">Your Name*</label>

            <input {...register("firstName", {required: true})} className="w-2/6  appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3 " type="text" id="yname" placeholder=" First Name" />
            <input className="w-2/6 appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3" type="text" id="yname" name="yname" placeholder="Last Name"></input><br></br>
            </div > */}
            <NameContainer label="Your Name*" id="yname" />



            {/* <div className="flex flex-row gap-11"> 
            <label className="w-1/5" htmlFor="email">Email*</label>
            <input className="w-4/5 appearance-none  block w-full bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3 " type="text" id="email" name="email" placeholder="e.g. css_luvr@rice.edu"></input><br></br>
            </div> */}
            {/* <FormRow2 label="Email*" placeholder="e.g. abc123@rice.edu" id="email" /> */}
            <ContainerOne label="Email*" id="email" placeholder="abc123@rice.edu"/>

            <div className="flex flex-row gap-7 items-center ">
            <label className="w-1/6" htmlFor="display"></label>
            <input type="checkbox" id="display" name="display"></input>
            <label htmlFor="display">Display on Listing for Buyers to Contact</label><br></br>
            </div>

            <ContainerOne label="Phone*" placeholder="e.g. 123-456-7890" id="phone" />

{/* three things in the div --> three cols auto-cols-max*/}
            {/* <div className="flex flex-row gap-10">
            <label className="w-1/6"htmlFor="phone">Phone*</label>
            <input className="w-5/6 appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3" type="text" id="phone" name="phone" placeholder="e.g. 956-862-0473 plz call"></input><br></br>
            </div> */}

            {/* <div className="flex flex-row gap-7">
            <label className="w-1/6" htmlFor="display"></label>
            <input type="checkbox" id="display" name="display"></input>
            <label htmlFor="display">Display on Listing for Buyers to Contact</label><br></br>
            </div>

            <div className="flex flex-row gap-9 ">
            <label className="w-1/5" htmlFor="delivery">Delivery*</label>
            <input type="checkbox" id="delivery"></input>
            <label className=" " htmlFor="delivery">On Campus</label>
            <input type="checkbox" id="delivery"></input>
            <label className=" " htmlFor="delivery">Buyer Picks Up Near Campus</label>
            <input type="checkbox" id="delivery"></input>
            <label className=" " htmlFor="type">Ship to Buyer</label><br></br>
            </div>

            <div className="flex flex-row gap-10 ">
            <label className="w-1/6" htmlFor="category">Category*</label>
            <input type="radio" id="category"></input>
            <label htmlFor="category">Course</label>
            <input type="radio" id="category"></input>
            <label htmlFor="category">Standardized Test</label>
            <input type="radio" id="category"></input>
            <label htmlFor="category">Other</label>
            </div> */}

            {/* useignn formrow3 for category but didnt work cuz there was an extra buttonn in the component */}
            <FormRow3 label="Category*" id="category" categories={["Course", "Standardized Test", "Other"]}/>


            {/* <label htmlFor="class/prep">Find a Class/Prep*</label>
            <input type="checkbox" id="delivery" name="delivery"></input><br></br> */}

            <ContainerOne label="Find a Class/Prep*" placeholder="e.g. COMP 182" id="delivery" />

            {/* <div className="flex flex-row gap-6">
            <label className="w-1/6" htmlFor="booktitle">Book Title*</label>
            <input className="w-5/6 appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3" type="text" id="booktitle" name="booktitle"></input><br></br>
            </div> */}
            
            <ContainerOne label="Book Title*" placeholder="e.g. Intro to Psych" id="booktitle" />

            {/* <div className="flex flex-row" >
            <label className="w-1/6" htmlFor="type">Type*</label>
            <input type="radio" id="type" ></input>
            <label htmlFor="type">Digital</label>
            <input type="radio" id="type" ></input>
            <label htmlFor="type">Hardcopy</label>
            <input type="radio" id="type" ></input>
            <label htmlFor="type">Equipment/Kit</label>
            <input type="radio" id="type" ></input>
            <label htmlFor="type">Other</label>
            </div> */}

            <FormRow3 id="type" label="Type*" categories={["Digital", "Hardcopy", "Equipment/Kit", "Other"]}/>
            
            {/* was taken off figma so i removed it  */}
            {/* <div className=" text-align-center">
            <p className=" text-center">If digital, you will be prompted to upload or link copy on next page</p>              
            </div> */}


            {/* <div className="flex flex-row gap-10"> 
            <label className="w-1/6"htmlFor="link">Link to source</label>
            <input className="w-5/6 appearance-none block bg-green-100 text-grey-darker border rounded py-15 px-4 mb-3" type="text" id="link" name="link" placeholder=" https://www.linkedin.com/in/diego-lopez-bernal/"></input><br></br>     
            </div> */}

            <ContainerOne label="Link to source" placeholder="e.g. https://" id="link" />

            {/* <div className="flex flex-row gap-10"> 
            <label className="w-1/6 " htmlFor="description">Description</label>
            <input className="w-5/6 appearance-none block bg-green-100 text-grey-darker border rounded py-20 px-4 mb-3" type="text" id="description" name="description" placeholder="The book is fine but the class left a scar...."></input><br></br>     
            </div> */}
            <ContainerOne label="Description" placeholder="blah blah blah" id="description" paragraph={true} />

            {/* <div className="flex felx-row gap-10">
            <label className="w-1/6" htmlFor="askingprice">Asking Price*</label>
            <input className="w-5/6 appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3" type="text" id="askingprice" name="askingprice"></input><br></br>
            </div> */}

            <ContainerOne label="Asking Price*" placeholder="$20" id="askingprice" />


            {/* <div className="flex flex-row gap-7">
            <label className="w-1/6" htmlFor="display"></label>
            <input type="checkbox" id="display" name="display"></input>
            <label htmlFor="display">Open to Negotiation?</label><br></br>
            </div> */}

            {/* 
            <div>
            <label htmlFor="images">Upload images</label>    
            </div> */}


            <div >
            <input className="appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-12 mb-3" type="submit" value="Submit Form"></input>   
            </div>
 



        </div> 
        </form>
        

    </div>
    )
}
export default Form;