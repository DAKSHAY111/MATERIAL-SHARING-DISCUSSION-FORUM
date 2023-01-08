import React from "react";
import { useState } from "react";

const ImageUpload = () => {
    
  const [image, setImage] = useState(null);

  const handleChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
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
