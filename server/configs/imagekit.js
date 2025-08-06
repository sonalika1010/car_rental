// configs/imagekit.js

import ImageKit from "imagekit";

const imagekit = new ImageKit({  // ← lowercase variable name
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export default imagekit;  // ← Export matches variable name