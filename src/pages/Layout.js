import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';
import './Global.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faPenToSquare, faBell, faFileLines } from '@fortawesome/free-regular-svg-icons'
import { faNetworkWired, faClockRotateLeft, faUser } from "@fortawesome/free-solid-svg-icons";

const Layout = () => {
  const [activeNav, setActiveNav] = useState('faPenToSquare');

  const handleNavClick = (iconName) => {
    setActiveNav(iconName);
  };



  return (
    <>
      <nav>
        <Link className='navControl' to="Home" onClick={() => handleNavClick('faBuilding')}>
          <span className={`${activeNav === 'faBuilding' ? 'navActive' : ''}`}></span>
          <div className='navButton'>
            <FontAwesomeIcon icon={faBuilding} />
          </div>
        </Link>
        <Link className='navControl' to="Employee" onClick={() => handleNavClick('faPenToSquare')}>
          <span className={`${activeNav === 'faPenToSquare' ? 'navActive' : ''}`}></span>
          <div className='navButton'>
            <FontAwesomeIcon icon={faPenToSquare} />
          </div>
        </Link>
        <Link className='navControl' to="NetWork" onClick={() => handleNavClick('faNetworkWired')}>
          <span className={`${activeNav === 'faNetworkWired' ? 'navActive' : ''}`}></span>
          <div className='navButton' >
            <FontAwesomeIcon icon={faNetworkWired} />
          </div>
        </Link>
        <Link className='navControl' to="Alert" onClick={() => handleNavClick('faBell')}>
          <span className={`${activeNav === 'faBell' ? 'navActive' : ''}`}></span>
          <div className='navButton' >
            <FontAwesomeIcon icon={faBell} />
            <FontAwesomeIcon icon={faFileLines} className='bellFile' />
          </div>
        </Link>
        <Link className='navControl' to="Historic" onClick={() => handleNavClick('faClockRotateLeft')}>
          <span className={`${activeNav === 'faClockRotateLeft' ? 'navActive' : ''}`}></span>
          <div className='navButton'>
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </div>
        </Link>
        <Link className='navControl' to="User" onClick={() => handleNavClick('faUser')}>
          <span className={`${activeNav === 'faUser' ? 'navActive' : ''}`}></span>
          <div className='navButton'>
            <FontAwesomeIcon icon={faUser} />
          </div>
        </Link>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;