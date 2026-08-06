import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {

  return (

    <>

      <Header
        name="Nensi Shingala"
        role="Computer Engineering Student"
      />

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/projects" element={<Projects />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<NotFound />} />

      </Routes>

      <Footer
        email="nensi@gmail.com"
        phone="+91 9876543210"
      />

    </>

  );

}

export default App;