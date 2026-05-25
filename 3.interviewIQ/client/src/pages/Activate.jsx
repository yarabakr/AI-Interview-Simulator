import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { ServerUrl } from "../App"

function Activate() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [message, setMessage] = useState("Activating...")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const res = await axios.get(
          ServerUrl + "/api/auth/activate/" + token
        )

        setMessage(res.data.message || "Account Activated ")
        
      
        setTimeout(() => {
          navigate("/auth")
        }, 2000)

      } catch (error) {
        setMessage(
          error.response?.data?.message || "Activation failed "
        )
      } finally {
        setLoading(false)
      }
    }

    activateAccount()
  }, [token, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          {loading ? "Activating..." : message}
        </h2>
      </div>
    </div>
  )
}

export default Activate