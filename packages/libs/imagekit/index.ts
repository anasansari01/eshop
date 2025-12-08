// SDK initialization

const ImageKit = require("imagekit");

export const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint : "https://ik.imagekit.io/anasF60"
});