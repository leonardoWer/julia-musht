import './App.css'

import gsap from 'gsap';
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {SplitText} from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);

import HomePage from "s/App/pages/HomePage/HomePage.jsx";

function App() {

  return (
    <>
      <HomePage/>
    </>
  )
}

export default App
