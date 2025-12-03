import Image from "next/image";
import Home from "./pages/Home/page";
import Footer from "./pages/footer/page";
import Kiwi from "./pages/kiwi/page";
import Growth from "./pages/Growth/page";
import Patient from "./pages/patient/page";
export default function Page() {
  return (
    <>
      <Home/>
      <Patient/>  
      <Kiwi/>
      <Growth/>
      
      <Footer/>
    </>
  );
}
