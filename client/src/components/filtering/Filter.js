import React, { useEffect, useState } from "react";
import FilterDropdown from "./FilterDropdown";
import FilterRange from "./FilterRange";
import FilterOption from "./FilterOption";
import FilterLabel from "./FilterLabel.js";
import FilterButton from "./FilterButton";
import { gql, useLazyQuery } from "@apollo/client";

const Filter = ({ allListings, setListings }) => {
  const [getListings, {loading, data}] = useLazyQuery(query);
  // Get options from backend based on if subject or course
  const cat_label = "Category";
  const course_label = "Course";
  const format_label = "Type";
  const range_label = "Price Range";
  const range_dict = { min: 0, max: 3000, value: 3000, label: { 0: "Free" } };
  const status_label = "Listing Status";
  const pickup_label = "Pickup Type";

  const category_options = ["Textbook", "Standardized Test"];
  // const course_options = ["COMP 182", "ELEC 220", "HUMA 125"];
  const [courseOptions, setCourseOptions] = useState([]);
  const format_options = ["Hardcopy", "Digital"];
  const status_options = ["Available Only"];
  const pickup_options = [" On Campus", " Near Campus", " Shipped"];

  const [selected, setSelected] = useState({
    [cat_label]: [],
    [course_label]: [],
    [format_label]: [],
    [range_label]: [],
    [status_label]: [],
    [pickup_label]: [],
  });

  // const [selected, setSelected] = useState({});

  // const [selected, setSelected] = useState([]);

  const exSetSelected = (e) => {
    console.log(selected);
    console.log(e);
    setSelected(e);
  };

  const handleApply = () => {
    setListings(selected);
  }

  // function sayHello() {
  //   alert("You clicked me!");
  //   getListings({variables: {category: selected[[cat_label]][0], course: selected[[course_label]][0], type: selected[[format_label]][0]}})
  // }

  useEffect(() => {
    const courseTitles = new Set([]);
    allListings.forEach(listing => {
      if (listing.item.category == "Textbook") {
        const associatedCourse = listing["item"].courses[0];
        const courseTitle = associatedCourse["subject"] + " " + associatedCourse["courseNum"];
        courseTitles.add(courseTitle); 
      }
    });
    setCourseOptions(Array.from(courseTitles));
  }, [allListings]);
  //[
  //   { value: 'chocolate', label: 'Chocolate' },
  //   { value: 'strawberry', label: 'Strawberry' },
  //   { value: 'vanilla', label: 'Vanilla' }
  // ]
  //const options = {} Some backend call
  return (
    <div class="flex flex-col">
      <div class="py-5">
        <FilterDropdown
          selected={selected}
          setSelected={exSetSelected}
          label={cat_label}
          options={category_options}
          placeholder={"Select Category"}
        />
      </div>
      <div>
        <FilterDropdown
          selected={selected}
          setSelected={exSetSelected}
          label={course_label}
          options={courseOptions}
          placeholder={"Select Course"}
        />
      </div>
      <div class="py-5">
        <FilterDropdown
          selected={selected}
          setSelected={exSetSelected}
          label={format_label}
          options={format_options}
          placeholder={"Select Type"}
        />
      </div>
      {/* <FilterRange label={range_label} options={range_dict} /> */}
      {/* <div class="py-5">
        <FilterOption
          selected={selected}
          label={status_label}
          options={status_options}
          placeholder={"Hardcopy, Digital, etc."}
        />
      </div>
      <div class="py-5">
        <FilterOption
          selected={selected}
          label={pickup_label}
          options={pickup_options}
          placeholder={"This"}
        />
      </div> */}
      <div class="py-5">
        <FilterButton label="Apply Filter" handleClick={handleApply} />
      </div>
    </div>
  );
};

const query = gql`
  query FilterListings($category: String, $course: String, $type: String) {
    listingsByFilter(
      category: $category
      subject: $course
      type: $type
      min_price: 0
      max_price: 2500
    ) {
      seller
      _id
      availability
    }
  }
`;

export default Filter;
