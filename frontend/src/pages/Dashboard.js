import React, { useState } from 'react'
import axios from 'axios'
import * as Icon from 'react-bootstrap-icons'
import '../styles/dashboard.css'

const Dashboard = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const [companies, setCompanies] = useState([]) 
  const [distinctCompanies, setDistinctCompanies] = useState([]) 
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  
  let [visible, setVisible] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get('http://localhost:5000/finsights/search-company', {
          params: {
            search: searchTerm
          }
        }
      )

      setCompanies(res.data.rows)
      setDistinctCompanies(res.data.distinctCompanies)

      if (res.data.rows.length > 0) { 
        setVisible(true)
      } else {
        setVisible(false)
      }
    }
    catch (error) {
      console.log(error)
    }

  }

  const handleClick = async (id) => {
    setSelectedCompanyId(id);

    try{
      let res = await axios.get(`http://localhost:5000/finsights/no-of-companies`, {
        params: {
          id: id
        }
      })

      res = await axios.get(`http://localhost:5000/finsights/company-stats`, {
        params: {
          id: id
        }
      })
    }
    catch(err){
      console.log("Error: ",  err)
    }

  }

  let selectedCompanies = companies.find(company => company.id === selectedCompanyId)

  return (
    <div className='row py-1 px-3'>
      <div className='search-panel container col-lg-4 col-md-4 col-sm p-2'>

        {/* Search Button */}
        <form className="form-inline my-lg-0 d-flex flex-direction-column" onSubmit={handleSubmit}>
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

        {/* Query Results Panel */}
        <div className='company-results container-fluid p-3 mt-1 bg-secondary rounded'>
          {(visible) ? <p className='fst-italic text-white text-center'>Matches found: {distinctCompanies.length}</p> : (<></>)}
          <ul className='scroll-view'>
          {distinctCompanies.map(distinctCompany => ( 
                <li key={distinctCompany.id} className='m-0 p-0 d-flex flex-column justify-content-center'>
                  <button 
                    className='btn btn-outline-warning py-2 px-4'
                    onClick={() => handleClick(distinctCompany.id)}><p className='m-0'><strong>{distinctCompany.name}</strong>, {distinctCompany.country}</p></button>
                  <hr />
                </li>
              ))}
          </ul>
          <div>
            {
              visible ? (
                <p className='h6 text-white text-center'>These are the matching companies in various countries found in the database.</p>
              ) : (
                <p className='h6 text-white text-center'>Matching companies will be visible here.</p>
              )
            }
          </div>
        </div>
      </div>

        {/* Computed Results Panel  */}
      <div className='result-panel container col-lg-8 col-md bg-black my-2 p-4 rounded'>
        <p className='h2 fst-bold text-center text-white d-flex justify-content-center align-items-center'>Computed results</p>

        {selectedCompanies && ( 
          <div className="company-results">
            <ul className='scroll-view'>
              <li>ID: {selectedCompanies.id}</li>
              <li>Name: {selectedCompanies.name}</li>
              <li>Country: {selectedCompanies.country}</li>
              <li>Country code: {selectedCompanies.country_code}</li>
              <li>Market cap: $ {selectedCompanies.market_cap}</li>
              <li>Diversity: {selectedCompanies.diversity}%</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
