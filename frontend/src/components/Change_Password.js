import React ,{ useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Change_Password = () => {
    const navigate = useNavigate()
    const userId = localStorage.getItem('userId')
    useEffect( () => {
        if(!userId){
            navigate('/login')
        }
    },[])

    const [formData, setFormData] = useState({
        oldPassword : '',
        newPassword : '',
        confirmPassword : '',
    })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name] : e.target.value })
    };
    
    const handleSubmit =  async(e) => {
        e.preventDefault()
        if(formData.newPassword !== formData.confirmPassword){
            toast.error("New password and Confirm password are mismatched!")
            return;
        }
            try{
                const response = await fetch(`http://127.0.0.1:8000/api/change_password/${userId}/`,{
                method : 'POST',
                headers : {'Content-Type':'application/json'},
                body : JSON.stringify({
                    formData,
                    oldPassword : formData.oldPassword,
                    newPassword : formData.newPassword,
                    confirmPassword : formData.confirmPassword
                })
            })
                const data = await response.json()
                if(response.status===201){
                    toast.success(data.message)
                    setTimeout(() => {
                        localStorage.removeItem('userId')
                        navigate('/login')
                    },1000)
                    setFormData({oldPassword:'',newPassword:'', confirmPassword:''})
                }else{
                    toast.error(data.message)
                }
            }
            catch(error){
                console.log('Error: ',error)
                toast.error('Something went wrong!')
            }
        }


  return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
    <form className="border rounded shadow p-4" style={{ maxWidth: '500px', width: '100%' }} onSubmit={handleSubmit}>
      <div className="text-start mb-3">
  <button 
    type="button" 
    className="btn btn-link p-0"
    onClick={() => navigate(-1)}
  >
    <b><i className="fa-solid fa-arrow-left fa-2xl" style={{color:'black'}}></i></b>
  </button>
</div>

      <h1 className="text-center mb-4">
        <i className="fas fa-key me-2"></i>Change Password
      </h1>
      <div className="mb-3">
        <label className="form-label d-block text-start">
          <i className="fas fa-lock-open me-2"></i>Password
        </label>
        <input type="password" name="oldPassword" className="form-control" onChange={handleChange} required placeholder="Enter your old password"/>
      </div>

      <div className="mb-3">
        <label className="form-label d-block text-start">
          <i className="fa-solid fa-lock me-2"></i>New Password
        </label>
        <input type="password" name="newPassword" className="form-control" onChange={handleChange} required placeholder="Enter new password"/>
      </div>

      <div className="mb-3">
        <label className="form-label d-block text-start">
          <i className="fas fa-lock me-2"></i>Confirm Password
        </label>
        <input type="password" name="confirmPassword" className="form-control" onChange={handleChange} required placeholder="Enter new password again"
        />
      </div>

      <button type="submit" className="btn btn-primary w-100 mt-3">
        Save
      </button>
      <ToastContainer />
    </form>
  </div>
  )
}

export default Change_Password