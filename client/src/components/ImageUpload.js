import React from "react";
import { useState } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const [ImgUrl, setImgUrl] = useState(null);
  const handleChange = (event) => {
    setImage(event.target.files[0]);
    console.log(
      "🚀 ~ file: imageUpload.js:12 ~ handleChange ~ event.target.files[0]",
      event.target.files[0]
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "materialSharingApp");
    formData.append("cloud_name", "dr08zgkg2");
    console.log(
      "🚀 ~ file: imageUpload.js:21 ~ handleSubmit ~ formData",
      formData
    );

    fetch("https://api.cloudinary.com/v1_1/dr08zgkg2/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setImgUrl(data.url);
      })
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select an image:
        <input type="file" onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Submit</button>
      {ImgUrl && <img src={ImgUrl} alt="upload-preview" />}
    </form>
  );
};

export default ImageUpload;
