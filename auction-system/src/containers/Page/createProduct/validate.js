import * as yup from "yup";

const yString = yup.string();
const yNumber = yup.number();
export default yup.object().shape({
  email: yString.email("Invalid email address").required("Email is required!"),
  title: yString.required("Product title is required!"),
  //   open_Time: yString.required("Starting Time is required!"),
  //   close_Time: yString.required("Ending Time is required!"),
  detail: yString.required("Detail is required!"),
  //video_link: yString.required("video link is required!"),
  price: yString.required("Price value greater than zero is required!"),
  stock: yNumber.required("Stock value greater than zero is required!"),
});
