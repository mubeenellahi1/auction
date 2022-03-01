import React, { Component, lazy, Suspense } from "react";
import Route from "../../components/utility/customRoute";
import Loader from "../../components/utility/Loader/";

const routes = [
  {
    path: "",
    component: lazy(() => import("../Dashboard")),
  },
  {
    path: "blank-page",
    component: lazy(() => import("../BlankPage")),
  },
  {
    path: "seller/create-product",
    component: lazy(() => import("../Page/createProduct/create-product")),
  },
  {
    path: "list-of-products",
    component: lazy(() => import("../Page/listOfProducts/listOfProducts")),
  },
  {
    path: "product-detail/:key/:is_seller?",
    component: lazy(() => import("../Page/productDetail/productDetail")),
  },
  {
    path: "cart-detail",
    component: lazy(() => import("../Page/cartDetails/cartDetails")),
  },
  {
    path: "checkout",
    component: lazy(() => import("../Page/checkout/checkout")),
  },
  {
    path: "my-products",
    component: lazy(() => import("../Page/myProducts/myProducts")),
  },
  {
    path:'edit-product/:key',
    component:lazy(()=> import("../Page/editProduct/editProduct"))
  }
];

class AppRouter extends Component {
  render() {
    const { url, style } = this.props;
    return (
      <Suspense fallback={<Loader />}>
        <div style={style}>
          {routes.map((singleRoute) => {
            const { path, exact, ...otherProps } = singleRoute;
            return (
              <Route
                exact={exact === false ? false : true}
                key={singleRoute.path}
                path={`${url}/${singleRoute.path}`}
                {...otherProps}
              />
            );
          })}
        </div>
      </Suspense>
    );
  }
}

export default AppRouter;
