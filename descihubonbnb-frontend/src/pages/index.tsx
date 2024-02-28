import React, { useRef, useState } from "react";
import Hero from "../components/layout/Hero";
import Feature from "../components/Feature";
const containerStyle = {
  backgroundColor: 'rgba(0, 0, 255, 0.1)', // Slightly bluish background
  color: 'white',
  backdropFilter: 'blur(10px)', // Glassmorphism effect
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' // Shadow effect
};

const App = () => {

  return (
    <>
    <div style={containerStyle}>
    <Hero />
    <Feature />
    </div>
    </>
  );
};

export default App;
