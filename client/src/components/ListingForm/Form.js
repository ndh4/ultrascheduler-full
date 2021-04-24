import React from "react"
import { useForm } from "react-hook-form";
import './Form.css'



// props that were being plugged into each container

// props for the input boxes
const ParagraphElem = ({ id, placeholder }) => <textarea className={`flex-grow w-2/6 appearance-none block bg-blue-100 text-grey-darker border-green-100 border rounded px-4 mb-3 mr-1 ml-5`} rows={5} type="text" id={id} name={id} placeholder={placeholder} />
// props for the input placeholder text
const InputElem = ({ id, placeholder }) => <input className={`flex-grow w-2/6 appearance-none block bg-blue-100 text-grey-darker border-green-100 border rounded py-3 px-4 mb-3 ml-5`} type="text" id={id} name={id} placeholder={placeholder} />

// namecontainer is for the first row components that takes in the name
const NameContainer = ({ label, id}) => {
    return (
        <div className="flex flex-row gap-7">
            <label className="font-bold w-1/6" htmlFor={id}>{label}</label>
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
        <div className="flex flex-row gap-7 ">
            <label  className="font-bold w-1/6 " htmlFor={id}>{label}</label>
            { paragraph == true ? (
            <ParagraphElem {...props} />
            ) : (<InputElem {...props}  />)}
        </div>
    )
}

// container for category and type that has radios (circular buttons) for the possible inputs
const FormRow3 = ({ id, label, categories }) => {
    return (
        <div className="flex flex-row gap-4 items-center">
            <label className="font-bold w-1/6 mr-6" htmlFor={id}> {label} </label>
            {/* .map is a for loop where the categories (things that you can pick) are mapped buttons */}
            {categories.map(catType => {
                return (
                    <React.Fragment>
                        <input className="ml-2 " type="radio" id={catType} />
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
        <div className="text-green-100 text-4xl text-center p-10"> 
        <h1 className="font-bold system-ui">New Listing</h1>
        </div>
       
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-5/6 flex flex-col flex-wrap mx-20 mr-20 overflow-hidden align-center text-lg text-green-100  system-ui"> 

                
                <NameContainer {...register("firstName", {required: true})} label="Your Name*" id="yname" />



                {/* <div className="flex flex-row gap-11"> 
                <label className="w-1/5" htmlFor="email">Email*</label>
                <input className="w-4/5 appearance-none  block w-full bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3 " type="text" id="email" name="email" placeholder="e.g. css_luvr@rice.edu"></input><br></br>
                </div> */}
                {/* <FormRow2 label="Email*" placeholder="e.g. abc123@rice.edu" id="email" /> */}
                <ContainerOne  {...register("email", {required: true})} label="Email*" id="email" placeholder="abc123@rice.edu"/>

                <div className="flex flex-row gap-7 items-center ">
                <label className="w-1/6" htmlFor="display"></label>
                <input className="ml-5" type="checkbox" id="display" name="display"></input>
                <label htmlFor="display">Display on Listing for Buyers to Contact</label><br></br>
                </div>

                <ContainerOne {...register("phoneNumber", {required: true})} label="Phone*" placeholder="e.g. 123-456-7890" id="phone" />

                {/* delivery is the only component not in a container bc it uses checkboxes */}
                <div className="flex flex-row gap-4 items-center">
                <label className="w-1/6 font-bold mr-8" htmlFor="delivery">Delivery*</label>
                <input type="checkbox" id="delivery"></input>
                <label className=" " htmlFor="delivery">On Campus</label>
                <input type="checkbox" id="delivery"></input>
                <label className=" " htmlFor="delivery">Buyer Picks Up Near Campus</label>
                <input type="checkbox" id="delivery"></input>
                <label className=" " htmlFor="type">Ship to Buyer</label><br></br>
                </div>

                {/* useignn formrow3 for category but didnt work cuz there was an extra buttonn in the component */}
                <FormRow3 label="Category*" id="category" categories={["Course", "Standardized Test", "Other"]}/>


                <ContainerOne label="Find a Class/Prep*" placeholder="e.g. COMP 182" id="delivery" />

                
                <ContainerOne {...register("title", {required: true})} label="Book Title*" placeholder="e.g. Intro to Psych" id="booktitle" />


                <FormRow3 id="type" label="Type*" categories={["Digital", "Hardcopy", "Equipment/Kit", "Other"]}/>
                
                

                <ContainerOne {...register("link", {required: true})} label="Link to source" placeholder="e.g. https://" id="link" />

                
                <ContainerOne {...register("description", {required: true})} label="Description" placeholder="blah blah blah...." id="description" paragraph={true} />

             
                <ContainerOne {...register("price", {required: true})} label="Asking Price*" placeholder="$20" id="askingprice" />


                


                <div >
                {/* <button className="appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-12 mb-3" type="submit" value="Submit Form"></button>   
                 */}
                 {/* <button>Submit form</button> */}
                 <button class="bg-teal-100 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded" type="submit" value="Submit Form">
                    Submit
                 </button>
                </div>

                {/* <input type="submit" value="submit" /> */}

            </div> 

            
        </form>
        

    </div>
    )
}
export default Form;