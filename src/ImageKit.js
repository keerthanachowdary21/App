import ImageKit from 'imagekit-javascript';

const imagekit = new ImageKit({
  publicKey: 'public_/tVM0fTcZd55dQkRfAZLYVH4NoE=',
  urlEndpoint: 'https://ik.imagekit.io/dateuni', // e.g., 'https://ik.imagekit.io/your_account_id'
});

const uploadImage = async (file) => {
  try {
    const response = await imagekit.upload(
      {
        file: file, // File can be a URL, Base64 string, or local path
        fileName: 'my-uploaded-image',
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading image:', error);
        } else {
          console.log('Upload successful:', result);
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
  }
};
