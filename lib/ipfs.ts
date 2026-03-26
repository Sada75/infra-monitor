import axios from "axios";
import FormData from "form-data";

export async function uploadToIPFS(file: Buffer) {
  const formData = new FormData();
  formData.append("file", file, {
    filename: "image.jpg",
  });

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    }
  );

  return res.data.IpfsHash;
}