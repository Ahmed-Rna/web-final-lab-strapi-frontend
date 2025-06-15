import Navbar from "../Components/Navbar";
import Video from "../Components/Video";

export default function Hero() {
  return (
   <>
    <div className="sticky top-0 z-50 bg-white border-b">
        <Navbar />
    </div>
     
    <div className="top-0 w-full h-auto" style={{ marginTop: '-40px' }}> 
        <Video/>
    </div> 
   </>
  )
}
