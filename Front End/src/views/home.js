import React from 'react'

import { Helmet } from 'react-helmet'

import './home.css'

const Home = (props) => {
  return (
    <div className="home-container">
      <Helmet>
        <title>Well Groomed Ajar Elk</title>
        <meta property="og:title" content="Well Groomed Ajar Elk" />
      </Helmet>
      <div className="home-desktop1">
        <img
          src="/external/rectangle126-v4i8-700h.png"
          alt="Rectangle126"
          className="home-rectangle1"
        />
        <span className="home-text1">Sign up now</span>
        <div className="home-input1">
          <span className="home-text2 InputFieldLabel">Confirm Password</span>
          <div className="home-textbox1"></div>
        </div>
        <div className="home-input2">
          <span className="home-text3 InputFieldLabel">password</span>
          <div className="home-textbox2"></div>
        </div>
        <div className="home-input3">
          <span className="home-text4 InputFieldLabel">Email</span>
          <div className="home-textbox3"></div>
        </div>
        <div className="home-input4">
          <span className="home-text5 InputFieldLabel">Phone</span>
          <div className="home-textbox4"></div>
        </div>
        <div className="home-textbox5">
          <span className="home-text6">patrickstar@bikini.com</span>
        </div>
        <div className="home-input5">
          <span className="home-text7 InputFieldLabel">First name</span>
          <div className="home-textbox6"></div>
        </div>
        <div className="home-input6">
          <span className="home-text8 InputFieldLabel">Last name</span>
          <div className="home-textbox7"></div>
        </div>
        <img
          src="/external/dumbbellsnzl1632-k5uc-500h.png"
          alt="dumbbellsnzl1632"
          className="home-dumbbellsnzl1"
        />
        <button className="home-button">
          <span className="home-text9 SingleLineBodyBase">Sign Up</span>
        </button>
      </div>
    </div>
  )
}

export default Home
