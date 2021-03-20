import React from "react"
import './Form.css'

function Form(){
    return(
     <div className= 'Field'>   
        <html>
            <body>
                <h1>New Listing</h1>
        
                <form action="/action_page.php">
                    <label for="yname">Your Name*</label>
                    <input type="text" id="yname" name="yname"></input>
                    <input type="text" id="yname" name="yname"></input><br></br>

                    <label for="email">Email*</label>
                    <input type="text" id="email" name="email"></input><br></br>

                    <input type="button" id="display" name="display"></input>
                    <label for="display">Display on Listing for Buyers to Contact</label><br></br>

                    <label for="phone">Phone*</label>
                    <input type="text" id="phone" name="phone"></input><br></br>

                    <label for="delivery">Delivery*</label>
                    <input type="button" id="delivery"></input>
                    <label for="delivery">On Campus</label>
                    <input type="button" id="delivery"></input>
                    <label for="delivery">Buyer Picks Up Near Campus</label>
                    <input type="button" id="delivery"></input>
                    <label for="type">Ship to Buyer</label>
                    <input type="button" id="delivery"></input><br></br>

                    <input type="button" id="display" name="display"></input>
                    <label for="display">Display on Listing for Buyers to Contact</label><br></br>

                    <label for="class/prep">Class/Prep*</label>
                    <input type="button" id="delivery" name="delivery"></input><br></br>

                    <label for="booktitle">Book Title*</label>
                    <input type="text" id="booktitle" name="booktitle"></input><br></br>
                    

                    <label for="type">Type*</label>
                    <input type="button" id="type" name="type"></input>
                    <label for="type">Digital</label>
                    <input type="button" id="type" name="type"></input>
                    <label for="type">Hardcopy</label>
                    <input type="button" id="type" name="type"></input>
                    <label for="type">Equipment/Kit</label>
                    <input type="button" id="type" name="type"></input>
                    <label for="type">Other</label>
                    <p>If digital, you will be prompted to upload or link copy on next page</p>

                    <label for="description">Description</label>
                    <input type="text" id="description" name="description"></input><br></br>

                    <label for="askingprice">Asking Price*</label>
                    <input type="text" id="askingprice" name="askingprice"></input><br></br>
                    
                    <input type="button" id="type" name="type"></input>
                    <label for="opentonegotiation">Open to Negotiation?</label><br></br>

                    <label for="images">Upload images</label>

                    <input type="submit" value="Submit Form"></input>


                </form>
            </body>
        </html>
    </div>
    )
}
export default Form;