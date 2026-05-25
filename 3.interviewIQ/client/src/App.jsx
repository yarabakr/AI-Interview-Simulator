import React from 'react'
import {Routes , Route} from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import InterviewPage from './pages/InterviewPage'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import Activate from './pages/Activate'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/InterviewReport'
import Contact from './pages/Contact'

export const ServerUrl ="http://localhost:8000"

function App() {

  const dispatch = useDispatch()


  useEffect(()=>{
    const getUser = async ()  => {
      try{
       const result = await axios.get(ServerUrl + "/api/user/current-user",
        {withCredentials:true})
        dispatch(setUserData(result.data))
      }catch(error){
        console.log(error)
         dispatch(setUserData(null))
      }
    }

     getUser()    
  },[dispatch])


  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/activate/:token' element={<Activate/>}/>
      <Route path='/interview' element={<InterviewPage/>}/>
      <Route path="/interview/:id" element={<InterviewPage />} />
      <Route path='/history' element={<InterviewHistory/>}/>
      <Route path='/pricing' element={<Pricing/>}/>
      <Route path='/report/:id' element={<InterviewReport/>}/>
      <Route path='/contact' element={<Contact/>}/>
        


    </Routes>
  )
}

export default App