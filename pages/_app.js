import "@/styles/globals.css";
// when ever i make componenets is best to throw it in my app.js 
// internal import 
import { NavBar,Footer } from "../Components";
export default function App({ Component, pageProps }) {
  return (
    <>
    <NavBar/>
    <Component {...pageProps} />
    <Footer/>
    </>

  )
}
