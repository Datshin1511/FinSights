import React, { useState, useEffect } from 'react'
import '../styles/footer.css'

const Footer = () => {

  // const h6 = document.querySelector("h6")

  // h6.innerHTML = (window.innerWidth < 1000) ? ('Designed & Maintained by..') : ('Designed & Maintained by Datshin Rajesh <sup>&trade;</sup> 2024-2025. All rights reserved.')

  return (
    <footer>

      <div className='footer-main-div'>
        <div className='footer-details'>
          <ul>
            <li>Solutions</li>
            <li>Careers</li>
            <li>Pricing</li>
            <li>Motivation & journey</li>
          </ul>
        </div>

        <div className='footer-monitoring'>
          <ul>
            <li>
              <i class="bi bi-building-check"></i>
              <p>This is a sample text</p>
            </li>
            <li>
              <i class="bi bi-building-check"></i>
              <p>Another sample text below the first sample text</p>
            </li>
          </ul>
        </div>
      </div>

      <h6 className='my-3 text-secondary'>&copy; 2024-2025. Designed & Maintained by Datshin Rajesh.</h6>

    </footer>
  )
}

export default Footer