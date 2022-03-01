import Papersheet from "../../../components/utility/papersheet";
import React, { useState } from "react";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import ImageCrop from "./image-croper";
import { FormsComponentWrapper, FormsMainWrapper } from "./product.style";
import { FullColumn } from "../../../components/utility/rowColumn";
import MyInnerForm from "./createProduct-form";
import { createProductService } from "../../../services/productsServices";
import { updateProductService } from "../../../services/productsServices";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { useHistory } from "react-router";
import { getProductDetails } from "../../../services/productsServices";
import { CircularProgress } from "@material-ui/core";
import { API_URL } from "../../../services/config";

export function ProductCreate(props) {
  let history = useHistory();
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const [images, setImages] = useState({});
  const [type, setType] = useState({});
  const [message, setmessage] = useState({});
  const [snackBarClass, setsnackBarClass] = useState({});
  const [open, setOpen] = useState(false);
  const [isFeatured, setisFeatured] = useState({});
  const [tags, setTags] = useState([]);
  const [openTime, setOpenTime] = useState([]);
  const [closeTime, setCloseTime] = useState([]);
  const [product, setProduct] = useState({});

  const isEditPage = props.isEditPage;
  const productUUID = props.productUUID;
  let imgs = [];

  React.useEffect(() => {
    if (isEditPage) {
      (async function anyNameFunction() {
        let prod = await getProductDetails(productUUID);
        prod = prod.data.data;
        if (prod.images) {
          let count = 0;
          for (let i of prod.images) {
            i.image = API_URL + i.image;

            imgs.push(i.image);
            if (i.isFeatured === true) {
              setisFeatured("image - " + count);
            }
            count++;
          }
          setImages(imgs);
        }
        setTags(prod.tags);
        setProduct(prod);
      })();
    }
  }, []);

  const setTagsSelect = (e) => {
    setTags(e);
  };

  const setOpeningTime = (e) => {
    let startTime = new Date(e.target.value);

    let endObj = document.getElementById("close_time");
    let endTime = null;
    if (endObj) {
      endTime = new Date(endObj.value);
    }

    if (startTime <= Date.now() || (endTime != null && startTime >= endTime)) {
      setmessage("Start time should be greater than current date");
      setsnackBarClass("error");
      setOpen(true);

      document.getElementById("open_time").value = "";
      e.target.value = null;
    }
    const year = new Date(e.target.value).getUTCFullYear();
    const month = new Date(e.target.value).getUTCMonth();
    const day = new Date(e.target.value).getUTCDate();
    const hour = new Date(e.target.value).getUTCHours();
    const min = new Date(e.target.value).getUTCMinutes();
    const sec = new Date(e.target.value).getUTCSeconds();
    const ms = new Date(e.target.value).getUTCMilliseconds();

    setOpenTime(new Date(Date.UTC(year, month, day, day, hour, min, sec, ms)));
  };

  const setClosingTime = (e) => {
    let endTime = new Date(e.target.value);

    if (
      endTime <= Date.now() ||
      endTime <= new Date(document.getElementById("open_time").value)
    ) {
      document.getElementById("close_time").value = "";
      e.target.value = null;
      setmessage("End date should be greater than start date");
      setsnackBarClass("error");
      setOpen(true);
    }
    const year = new Date(e.target.value).getUTCFullYear();
    const month = new Date(e.target.value).getUTCMonth();
    const day = new Date(e.target.value).getUTCDate();
    const hour = new Date(e.target.value).getUTCHours();
    const min = new Date(e.target.value).getUTCMinutes();
    const sec = new Date(e.target.value).getUTCSeconds();
    const ms = new Date(e.target.value).getUTCMilliseconds();

    setCloseTime(new Date(Date.UTC(year, month, day, day, hour, min, sec, ms)));
  };

  const setProductType = (event) => {
    setType(event.target.value);
  };

  const setImageisFeatured = (event) => {
    setisFeatured(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onSubmit = async (values) => {
    let imageArray = [];

    for (const [key, value] of Object.entries(images)) {
      imageArray[key] = {};
      imageArray[key]["image"] = value;
      if (key === isFeatured || key === values.isFeatured.toString()) {
        imageArray[key]["is_featured"] = true;
      } else {
        imageArray[key]["is_featured"] = false;
      }
    }
    values["isFeatured"] =  values.isFeatured.toString() || isFeatured;
    values["images"] = imageArray;
    values["tags"] = tags;
    values["type"] = type || values.type;
    values["open_time"] =  values.open_Time || openTime;
    values["close_time"] = values.close_Time || closeTime;

    if(isEditPage)
    values["product_uuid"]= productUUID;

    if (
      !values.type ||
       document.getElementById("title").value === "" ||
      isNaN(document.getElementById("price").value) ||
      document.getElementById("price").value <= 0 ||
      (document.getElementById("demo-simple-select").value ===
        "limited product" &&
        isNaN(document.getElementById("stock").value)) ||
      document.getElementById("stock").value <= 0 ||
      values.isFeatured == "" ||
      ! values.close_time ||
      values.close_time.length <= 0 ||
      !values.open_time ||
      values.open_time.length <= 0 ||
      document.getElementById("detail").value === ""
    ) {
      setsnackBarClass("error");
      setmessage("Please fill all details correctly");
      setOpen(true);
    } else if (imageArray.length < 3) {
      setsnackBarClass("error");
      setmessage("Please enter at least 3 images");
      setOpen(true);
    } else {
      if(isEditPage){
        delete values.open_Time 
        delete values.close_Time
        delete values.isFeatured 
        const updateProductServiceResponse = await updateProductService(values);
        if (updateProductServiceResponse.data.status === "success") {
          setmessage(updateProductServiceResponse.data.Message);
          setsnackBarClass("success");
          setOpen(true);
        } else {
          setsnackBarClass("error");
          setmessage("Unable to update product");
          setOpen(true);
        }
      }
      else{
      const createProductServiceResponse = await createProductService(values);
      if (createProductServiceResponse.data.status === "success") {
        setmessage(createProductServiceResponse.data.Message);
        setsnackBarClass("success");
        setOpen(true);
        setTimeout(() => {
          history.push("/dashboard/my-products");
        }, 750);
      } else {
        setsnackBarClass("error");
        setmessage("Unable to create product");
        setOpen(true);
      }
    }
    }
  };

  return product ? (
    <FormsMainWrapper>
      <FormsComponentWrapper
        className="mateFormsComponent"
        style={{
          color: "white",
          backgroundColor: "white",
          borderRadius: "7px",
          width: "fit-content",
          padding: "5px",
        }}
      >
        <FullColumn>
          {/* <Counter /> */}
          <ImageCrop images={images} setImages={setImages} />
          <MyInnerForm
            setTags={setTagsSelect}
            tags={tags}
            type={type}
            isFeatured={isFeatured}
            setisFeatured={setImageisFeatured}
            setType={setProductType}
            onSubmit={onSubmit}
            images={images}
            openTime={openTime}
            closeTime={closeTime}
            setOpeningTime={setOpeningTime}
            setClosingTime={setClosingTime}
            isEditPage={isEditPage}
            product={product}

            //title={"jksdajask"}
          />
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackBarClass}>
              {message}
            </Alert>
          </Snackbar>
        </FullColumn>
      </FormsComponentWrapper>
    </FormsMainWrapper>
  ) : (
    <CircularProgress></CircularProgress>
  );
}
//export default ProductCreate;

export default () => (
  <LayoutWrapper>
    <FullColumn>
      <Papersheet title="Create Product">
        <ProductCreate />
      </Papersheet>
    </FullColumn>
  </LayoutWrapper>
);
