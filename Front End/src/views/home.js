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
      <div className="home-sign-up">
        <img
          src="/external/image23532-nr9k-1100h.png"
          alt="image23532"
          className="home-image2"
        />
        <img
          src="/external/rectangle13326-zukm-900w.png"
          alt="Rectangle13326"
          className="home-rectangle1"
        />
        <div className="home-input1">
          <span className="home-text10 InputFieldLabel">Last name</span>
          <div className="home-textbox1">
            <span className="home-text11">fJtughy3#4$2@1!</span>
          </div>
        </div>
        <img
          src="/external/rectangle53330-csk-500w.png"
          alt="Rectangle53330"
          className="home-rectangle5"
        />
        <div className="home-standrdoutlinecircle1">
          <span className="home-text12">Sign up with Google</span>
          <div className="home-logo1">
            <img
              src="/external/shape3622-18ev.svg"
              alt="Shape3622"
              className="home-shape1"
            />
            <img
              src="/external/shape3622-14iu.svg"
              alt="Shape3622"
              className="home-shape2"
            />
            <img
              src="/external/shape3622-36jm.svg"
              alt="Shape3622"
              className="home-shape3"
            />
            <img
              src="/external/shape3622-yvv.svg"
              alt="Shape3622"
              className="home-shape4"
            />
          </div>
        </div>
        <span className="home-text13">Sign up now</span>
        <img
          src="/external/line23623-b5t6.svg"
          alt="Line23623"
          className="home-line2"
        />
        <img
          src="/external/line33624-kdlo.svg"
          alt="Line33624"
          className="home-line3"
        />
        <span className="home-text14">OR SIGN UP WITH E-MAIL</span>
        <div className="home-input2">
          <span className="home-text15">email</span>
          <div className="home-textbox2"></div>
        </div>
        <div className="home-input3">
          <span className="home-text16">PASSWORD</span>
          <div className="home-textbox3"></div>
        </div>
        <div className="home-input4">
          <span className="home-text17">Confirm Password</span>
          <div className="home-textbox4"></div>
        </div>
        <img
          src="/external/eye3628-vz94.svg"
          alt="Eye3628"
          className="home-eye1"
        />
        <img
          src="/external/eye3627-5wxi.svg"
          alt="Eye3627"
          className="home-eye2"
        />
        <button className="home-button1">
          <span className="home-text18 BodyBase">Sign up</span>
        </button>
        <span className="home-text19 M3labellarge">
          <span className="home-text20">
            Already have an account?
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span>Log In</span>
        </span>
      </div>
      <div className="home-sign-in">
        <img
          src="/external/image33637-ga8-1100h.png"
          alt="image33637"
          className="home-image3"
        />
        <img
          src="/external/rectangle63637-6zxr-900w.png"
          alt="Rectangle63637"
          className="home-rectangle6"
        />
        <div className="home-input5">
          <span className="home-text22 InputFieldLabel">Last name</span>
          <div className="home-textbox5">
            <span className="home-text23">fJtughy3#4$2@1!</span>
          </div>
        </div>
        <img
          src="/external/rectangle73637-o135-500w.png"
          alt="Rectangle73637"
          className="home-rectangle7"
        />
        <div className="home-standrdoutlinecircle2">
          <span className="home-text24">Sign in with Google</span>
          <div className="home-logo2">
            <img
              src="/external/shape3637-3v9m.svg"
              alt="Shape3637"
              className="home-shape5"
            />
            <img
              src="/external/shape3638-npu.svg"
              alt="Shape3638"
              className="home-shape6"
            />
            <img
              src="/external/shape3638-tz9.svg"
              alt="Shape3638"
              className="home-shape7"
            />
            <img
              src="/external/shape3638-aju9.svg"
              alt="Shape3638"
              className="home-shape8"
            />
          </div>
        </div>
        <span className="home-text25">Sign In</span>
        <img
          src="/external/line43638-q3q.svg"
          alt="Line43638"
          className="home-line4"
        />
        <img
          src="/external/line53638-q8gf.svg"
          alt="Line53638"
          className="home-line5"
        />
        <span className="home-text26">OR SIGN IN WITH E-MAIL</span>
        <div className="home-input6">
          <span className="home-text27">email</span>
          <div className="home-textbox6"></div>
        </div>
        <div className="home-input7">
          <span className="home-text28">PASSWORD</span>
          <div className="home-textbox7"></div>
        </div>
        <img
          src="/external/eye3639-u79g.svg"
          alt="Eye3639"
          className="home-eye3"
        />
        <button className="home-button2">
          <span className="home-text29 BodyBase">Sign in</span>
        </button>
        <span className="home-text30 M3labellarge">
          <span className="home-text31">
            Already have an account?
            <span
              dangerouslySetInnerHTML={{
                __html: ' ',
              }}
            />
          </span>
          <span>Log In</span>
        </span>
      </div>
    </div>
  )
}

export default Home
