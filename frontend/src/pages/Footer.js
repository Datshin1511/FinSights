/* eslint-disable jsx-a11y/anchor-is-valid */
import * as Icon from 'react-bootstrap-icons'
import '../styles/footer.css'

const Footer = () => {

  return (
    <footer className='p-3'>

      <div className='footer-main-div row'>

        <div className='footer-details col'>
          <ul className='d-flex flex-column'>
            <li><a href='#'>Solutions</a></li>
            <li><a href='#'>Careers</a></li>
            <li><a href='#'>Pricing</a></li>
            <li><a href='#'>Our aim</a></li>
          </ul>
        </div>

        {/* TODO: Vertical line to be inserted here */}

        <div className='footer-details col'>
          <ul className='d-flex flex-column'>
            <li><a href='#'>Search</a></li>
            <li><a href='#'>Contacts</a></li>
            <li><a href='#'>Our Team</a></li>
            <li><a href='#'>International Affairs</a></li>
          </ul>
        </div>

      </div>

      <h6 className='my-3 text-secondary'>&copy; 2024-2025. Designed & Maintained by Datshin Rajesh.</h6>

    </footer>
  )
}

export default Footer