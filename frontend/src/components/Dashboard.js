import React from 'react'
import * as Icon from 'react-bootstrap-icons'
import '../styles/dashboard.css'

const Dashboard = () => {
  return (
    <>
      <div className='container-fluid p-3 d-flex justify-content-end'>
        <form className="form-inline my-2 my-lg-0 d-flex" action='/search-company'>
          <input className="form-control mr-sm-2" type="search" placeholder="Search a company.." aria-label="Search" />
          <button className="btn btn-outline-success my-2 my-sm-0 mx-1" type="submit">
            <Icon.Search className='ml-4' />
          </button>
        </form>
      </div>
    </>
  )
}

export default Dashboard