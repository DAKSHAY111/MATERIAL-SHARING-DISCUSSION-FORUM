import React from "react";
import { useState } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const handleChange = (event) => {
    setImage(event.target.files[0]);
    console.log(
      "🚀 ~ file: imageUpload.js:12 ~ handleChange ~ event.target.files[0]",
      event.target.files[0]
    );
  };
  const handleSubmit = async (event) => {
    //upload image to server
    const response = await fetch(
      "http://127.0.0.1:9000//MaterialShare/post/testImage",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(image),
      }
    );

    const data = await response.json();
    // console.log(data.data);

    if (data.status === "success") {
      console.log(data);
      alert("Added successfully");
    } else {
      console.log("failed");
    }

    event.preventDefault();
    // Here, you can submit the image to your backend or do other things with it
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select an image:
        <input type="file" onChange={handleChange} />
      </label>
      <br />
      <button type="submit">Submit</button>
      {image && <img src={URL.createObjectURL(image)} alt="upload-preview" />}
    </form>
  );
};

export default ImageUpload;
