export default {
  apiUrl: "http://yoursite.com/api/",
};

const siteConfig = {
  siteName: "MetaAdmin",
  siteIcon: "ion-flash",
  footerText: "MetaAdmin ©2018 Created by RedQ, Inc",
  enableAnimatedRoute: false,
};
const themeConfig = {
  topbar: "themedefault",
  sidebar: "themedefault",
  layout: "themedefault",
  theme: "themedefault",
  showBreadCrumb: true,
  fixedNavbar: true,
};
const language = "english";
const AlgoliaSearchConfig = {
  appId: "",
  apiKey: "",
};
const Auth0Config = {
  domain: "",
  clientID: "",
  audience: "",
  options: {
    auth: {
      autoParseHash: true,
      redirect: false,
    },
    languageDictionary: {
      title: "Metaadmin",
      emailInputPlaceholder: "demo@gmail.com",
      passwordInputPlaceholder: "demodemo",
    },
    icon: "",
    theme: {
      labeledSubmitButton: true,
      logo: "",
      primaryColor: "#E14615",
      authButtons: {
        connectionName: {
          displayName: "Log In",
          primaryColor: "#b7b7b7",
          foregroundColor: "#000000",
          icon: undefined,
        },
      },
    },
  },
};
const firebaseConfig = {
  apiKey: "AIzaSyBFIzeh1HoPl_5AnlT63DKEb8VdrUGtP6o",
  authDomain: "auction-demo-7fb8a.firebaseapp.com",
  databaseURL: "https://auction-demo-7fb8a-default-rtdb.firebaseio.com",
  projectId: "auction-demo-7fb8a",
  storageBucket: "auction-demo-7fb8a.appspot.com",
  messagingSenderId: "1087916024859",
  appId: "1:1087916024859:web:91266e8015a11c3b4bc4be",
  measurementId: "G-0CKWXZB26Z",
};

const googleConfig = {
  apiKey: "", //
};
const mapboxConfig = {
  tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  maxZoom: 18,
  defaultZoom: 11,
  center: [0, 0],
};
const youtubeSearchApi = "";

const instagramConfig = {
  instagramUserInfoApiUrl:
    "https://api.instagram.com/v1/users/self/?access_token=",
  instagramUserMediaApiUrl:
    "https://api.instagram.com/v1/users/self/media/recent/?access_token=",
  accessToken: "",
};
const jwtConfig = {
  fetchUrl: "/api/",
  secretKey: "secretKey",
};
export {
  siteConfig,
  language,
  themeConfig,
  AlgoliaSearchConfig,
  Auth0Config,
  firebaseConfig,
  googleConfig,
  mapboxConfig,
  youtubeSearchApi,
  instagramConfig,
  jwtConfig,
};
