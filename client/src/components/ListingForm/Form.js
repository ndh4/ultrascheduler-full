import React from "react"
import { useForm } from "react-hook-form";
//import './Form.css'

function Form(){
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);
  
    console.log(watch("exampleRequired"));

    return(
    // container for the whole page is the div below
     <div className="width-100%">   
        {/* container for everything except the title */}
        <div className="text-green-500 text-4xl text-center p-10"> 
        <h1>New Listing</h1>
        </div>
        {/* mx is margin of x */}
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-5/6 flex flex-col flex-wrap mx-20 mr-20 overflow-hidden align-center text-lg text-green-500"> 

             {/* flex flex-row creates a row that has a certain x-axis dimension and then
             for each component in the row, we can assign a certain percent of the row for 
             it to take up */}
            <div className="flex flex-row gap-7">
            <label className=" w-1/6 " for="yname">Your Name*</label>
            {/* react hook form extra local put into input below */}
            <input {...register("exampleRequired", {required: true})} className="w-2/6  appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3 " type="text" id="yname" name="yname" placeholder=" First Name"></input>
            <input className="w-2/6 appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3" type="text" id="yname" name="yname" placeholder="Last Name"></input><br></br>
            </div >

            <div className="flex flex-row gap-11"> 
            <label className="w-1/5" for="email">Email*</label>
            <input className="w-4/5 appearance-none  block w-full bg-green-100 text-grey-darker border rounded py-3 px-4 " type="text" id="email" name="email" placeholder="e.g. css_luvr@rice.edu"></input><br></br>
            </div>

            <div className="flex flex-row justify-center gap-7">
            <label className="w-1/6" for="display"></label>
            <input type="checkbox" id="display" name="display"></input>
            <label for="display">Display on Listing for Buyers to Contact</label><br></br>
            </div>

{/* three things in the div --> three cols auto-cols-max*/}
            <div className="flex flex-row gap-0">
            <label className="w-1/5"for="phone">Phone*</label>
            <input className="w-4/5 appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3" type="text" id="phone" name="phone" placeholder="e.g. 956-862-0473 plz call"></input><br></br>
            </div>

            <div className="flex flex-row gap-7">
            <label className="w-1/6" for="display"></label>
            <input type="checkbox" id="display" name="display"></input>
            <label for="display">Display on Listing for Buyers to Contact</label><br></br>
            </div>

            <div className="flex flex-row gap-7">
            <label className="w-1/5" for="delivery">Delivery*</label>
            <input type="checkbox" id="delivery"></input>
            <label className="w-1/5" for="delivery">On Campus</label>
            <input type="checkbox" id="delivery"></input>
            <label className="w-1/2" for="delivery">Buyer Picks Up Near Campus</label>
            <input type="checkbox" id="delivery"></input>
            <label className="1/2" for="type">Ship to Buyer</label><br></br>
            </div>

            <div className="flex flex-row gap-10">
            <label className="w-1/6" for="category">Category*</label>
            <input type="radio" id="category"></input>
            <label for="category">Course</label>
            <input type="radio" id="category"></input>
            <label for="category">Standardized Test</label>
            <input type="radio" id="category"></input>
            <label for="category">Other</label>
            </div>


            <label for="class/prep">Find a Class/Prep*</label>
            <input type="checkbox" id="delivery" name="delivery"></input><br></br>

            <div className="flex flex-row gap-6">
            <label className="w-1/6" for="booktitle">Book Title*</label>
            <input className="w- 5/6 appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3" type="text" id="booktitle" name="booktitle"></input><br></br>
            </div>

            
            <div className="flex flex-row" >
            <label for="type">Type*</label>
            <input type="radio" id="type" name="type"></input>

            <label for="type">Digital</label>
            <input type="radio" id="type" name="type"></input>
            {/* radio gives circular checkboxes */}
            <label for="type">Hardcopy</label>
            <input type="radio" id="type" name="type"></input>
            <label for="type">Equipment/Kit</label>
            <input type="radio" id="type" name="type"></input>
            <label for="type">Other</label>
            </div>
            <p>If digital, you will be prompted to upload or link copy on next page</p>              


            <div className="flex flex-row gap-10"> 
            <label className="w-1/6"for="link">Link to source</label>
            <input className="w-5/6 appearance-none block bg-green-100 text-grey-darker border rounded py-15 px-4 mb-3" type="text" id="link" name="link" placeholder=" https://www.linkedin.com/in/diego-lopez-bernal/"></input><br></br>     
            </div>
            
            <div className="flex flex-row gap-10"> 
            <label className="w-1/6 " for="description">Description</label>
            <input className="w-5/6 appearance-none block bg-green-100 text-grey-darker border rounded py-20 px-4 mb-3" type="text" id="description" name="description" placeholder="The book is fine but the class left a scar...."></input><br></br>     
            </div>

            <div className="flex felx-row gap-9">
            <label className="w-1//6" for="askingprice">Asking Price*</label>
            <input className="w-5/6 appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3" type="text" id="askingprice" name="askingprice"></input><br></br>
            </div>

            <div className="flex flex-row gap-7">
            <input className="1/6 " type="checkbox" id="type" name="type"></input>
            <label for="opentonegotiation">Open to Negotiation?</label><br></br>   
            </div>

            {/* 
            <div>
            <label for="images">Upload images</label>    
            </div> */}


            <div >
            <input className="appearance-none block bg-green-100 text-grey-darker border rounded py-3 px-4 mb-3" type="submit" value="Submit Form"></input>   
            </div>
 



        </div> 
        </form>
        

    </div>
    )
}
export default Form;