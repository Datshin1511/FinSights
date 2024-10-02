import React, { useState } from 'react'
import axios from 'axios'
import * as Icon from 'react-bootstrap-icons'
import '../styles/dashboard.css'

const Dashboard = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const [companies, setCompanies] = useState([])
  let [visible, setVisible] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.post('http://localhost:5000/finsights/search-company', {
        search: searchTerm
      })
  
      setCompanies(res.data)

      if(companies.length > 0){
        setVisible(true)
      }
      
    }
    catch(error){
      console.log(error)
    }
    
    setCompanies([])
  }

  return (
    <div className='row py-1 px-3'>
      <div className='container-fluid col-lg-2 col-md-4 col-sm p-2'>
        <form className="form-inline my-lg-0 d-flex" onSubmit={handleSubmit}>
          <input 
            className="form-control mr-sm-2" 
            type="search" 
            name='search' 
            placeholder="Search a company.." 
            aria-label="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
          <button className="btn btn-outline-success my-2 my-sm-0 mx-1" type="submit">
            <Icon.Search className='ml-4' />
          </button>
        </form>

        <div className='container-fluid py-3 mt-1 bg-primary'>
          <ul>
            <li>Primary text</li>
            <li>Secondary text</li>
            <li>Tertiary text</li>
            <li>Quarternary text</li>
            <li>Pentanary text</li>
          </ul>
          <div>
            {
              (visible) ? (<p>Company details are received</p>) : (<p>No shit was observed in companies.</p>)
            }
          </div>
        </div>
      </div>

      <div className='container-fluid col-lg-10 col-md-8 bg-warning p-2'>
        <p className='h2 fst-bold text-center d-flex justify-content-center align-items-center'>Computed results</p>
      </div>
    </div>
  )
}

export default Dashboard