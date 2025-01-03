/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import ProfilePic from "../Assets/john-doe-image.png";
import PickMeals from "../Assets/pick-meals-image.png";
import ChooseMeals from "../Assets/choose-image.png";
import DeliveryMeals from "../Assets/delivery-image.png";
import { BsFillPlayCircleFill, BsTwitter, BsYoutube } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { FaFacebookF } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import './LandingPage.css'; 
import { HiOutlineBars3 } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />,
    },
    {
      text: "About",
      icon: <InfoIcon />,
    },
    {
      text: "Testimonials",
      icon: <CommentRoundedIcon />,
    },
    {
      text: "Contact",
      icon: <PhoneRoundedIcon />,
    },
    {
      text: "Cart",
      icon: <ShoppingCartRoundedIcon />,
    },
  ];
  return (
    <nav>
      <div className="nav-logo-container">
      <img src="Group.png" alt="Logo" style={{ width: "220px", height: "50px" }} />
      </div>
      <div className="navbar-links-container">
        <a href="https://www.youtube.com"> Demo Video</a>
        <a href="#about">About</a>
        <a href="#feedback">Feedback</a>
        <a href="#contact">Contact</a>
        <a href="">
          
        </a>
        <button
        className="primary-button"
        style={{
            marginRight: "10px", // Spacing between buttons
            border: "1px solid black", // Black stroke
          }}
        onClick={() => navigate('/signup')}
        >
        Sign up
        </button>
        <button
        className="primary-button"
        style={{
            backgroundColor: "#3E3FD8", // Default background color (blue)
            color: "white", // Default text color (white)
            transition: "0.3s", // Smooth transition for hover effect
        }}
        onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#2323b9"; // Darker blue on hover
            e.target.style.color = "white"; // Ensure text remains white
        }}
        onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#3E3FD8"; // Revert to original blue
            e.target.style.color = "white"; // Keep text white
        }}
        onClick={() => navigate('/login')}
        >
        Log in
        </button>



      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src="{AboutBackground}" alt="" />
      </div>
      <div className="about-section-image-container">
        <img src="girl.png" alt="img" />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">Features</p>
        <h1 className="primary-heading">
        Track Earnings and Expenses Effortlessly
        </h1>
        <p className="primary-text">
        Easily log income from sources like project payments, royalties, and consulting fees, while tracking and categorizing your business expenses.
        </p>
        
        <div className="about-buttons-container">
          <button className="secondary-button">Learn More</button>
          <button className="watch-video-button">
           
          </button>
        </div>
      </div>
    </div>
  );
};
const About1 = () => {
    return (
      <div className="about-section-container1">
        <div className="about-background-image-container1">
          <img src="{AboutBackground}" alt="" />
        </div>
        <div className="about-section-image-container1">
          <img src="image.png" alt="" />
        </div>
        <div className="about-section-text-container1">
          <p className="primary-subheading1"></p>
          <h1 className="primary-heading1">
          Smart Tools for Financial Success
          </h1>
          <p className="primary-text1">
          Manage invoices, estimate taxes, and set budgets with ease. Stay organized and in control of your finances while achieving your goals efficiently.
          </p>
          
          <div className="about-buttons-container1">
            <button className="secondary-button1">Learn More</button>
            <button className="watch-video-button1">
             
            </button>
          </div>
        </div>
      </div>
    );
  };
const Contact = () => {
  return (
    <div className="contact-page-wrapper">
      <h1 className="primary-heading">Have Question In Mind?</h1>
      
      <div className="contact-form-container">
        <input type="text" placeholder="yourmail@gmail.com" />
        <button className="secondary-button">Submit</button>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <section id="about" className="section">
      </section>
      <section id="contact" className="section">
      </section>
      
      <div className="footer-section-one">
        <div className="footer-logo-container">
        <img src="Group1.png" alt="Logo" style={{ width: "220px", height: "50px" }} />
        </div>
        <div className="footer-icons">
          <BsTwitter />
          <SiLinkedin />
          <BsYoutube />
          <FaFacebookF />
        </div>
      </div>
      <div className="footer-section-two">
        <div className="footer-section-columns">
          <span>Features</span>
          <span>Income Tracker</span>
          <span>Expense Tracker</span>
          <span>Budget Tracker</span>
          <span>Tax Caluclator</span>
          <span>Notification</span>
        </div>
        <div className="footer-section-columns">
          <span>044-456-034</span>
          <span>Tracknest@gmail.com</span>
          <span>TN@gmail.com</span>
          <span>TNcontact@gmail.com</span>
        </div>
        <div className="footer-section-columns">
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
const navigate = useNavigate();
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src="bg.png" alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Track Your Expenses To Save Money
          </h1>
          <p className="primary-text">
          Helps you to organize your income and expenses
          </p>
          <button className="secondary-button" onClick={() => navigate('/login')}>
            Get Started <FiArrowRight />
          </button>
        </div>
        <div className="home-image-section">
          <img src="3d.png" alt="" />
        </div>
      </div>
    </div>
  );
};

const Testimonial = () => {
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Feedback</p>
        <h1 className="primary-heading">What They Are Saying</h1>
        <p className="primary-text">
        Our customers love this platform!
        </p>
      </div>
      <div className="testimonial-section-bottom">
        <img src={ProfilePic} alt="" />
        <p>
        As a freelancer, managing my finances used to be a headache. This platform has transformed how I track income and expenses. I feel in control of my finances!
        </p>
        <div className="testimonials-stars-container">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
        </div>
        <h2>John Doe</h2>
      </div>
    </div>
  );
};

const Work = () => {
  const workInfoData = [
    {
      image: PickMeals,
      title: "Scheduling",
      text: "Organize your tasks, deadlines, and financial milestones to ensure nothing is missed.",
    },
    {
      image: ChooseMeals,
      title: "Reminders",
      text: "Get automated reminders for invoices, tax payments, and budget limits to stay ahead.",
    },
    {
      image: DeliveryMeals,
      title: "Data Vizualization",
      text: "Easily track progress with interactive charts and graphs for income, expenses & budget.",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Work</p>
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
        Track income, organize expenses, and stay on top of deadlines with automated reminders and intuitive tools.
          
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <div style={{ fontFamily: "'Reem Kufi', sans-serif" }}>
    <div className="LandingPage" >
    <div className="App">
      <Home />
      <About />
      <About1/>
      <Work />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
    </div>
    </div>
  );
};

export default LandingPage;
