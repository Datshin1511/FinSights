/* eslint-disable jsx-a11y/anchor-is-valid */
import * as Icon from 'react-bootstrap-icons'
import '../styles/footer.css'

const Footer = () => {

  return (
    <footer className='p-3'>

      <div className='footer-main-div row'>

        <div className='footer-details col-6'>
          <ul className='d-flex flex-column'>
            <li><a href='#'>Solutions</a></li>
            <li><a href='#'>Careers</a></li>
            <li><a href='#'>Pricing</a></li>
            <li><a href='#'>Our aim</a></li>
          </ul>
        </div>

        <div className='vertical-line'></div>

        <div className='footer-details col-6'>
          <ul className='d-flex flex-column my-1'>
            <li><a href='#'>First link</a></li>
            <li><a href='mailto:datshinr2002@gmail.com'>Share an idea!</a></li>
          </ul>

          <form className="form-inline mx-2 my-2 my-lg-0 d-flex mw-25" action=''>
            <input className="form-control mr-sm-2" type="search" placeholder="Enter email address" aria-label="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0 mx-1" type="submit">
              <Icon.Send className='ml-4' />
            </button>
          </form>
        </div>

      </div>

      <h6 className='my-3 text-secondary'>&copy; 2024-2025. Designed & Maintained by Datshin Rajesh.</h6>

    </footer>
  )
}

export default Footer