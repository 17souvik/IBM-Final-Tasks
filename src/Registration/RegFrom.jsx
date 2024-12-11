import React from 'react';
import './RegFrom.css';

export default function RegFrom(){
    const [formData, setFormData] = React.useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    
    const [errors, setErrors] = React.useState({});
    const [validFields, setValidFields] = React.useState({});
    
    const validateName = (name, fieldName) => {
      if (!name) return `${fieldName} is required`;
      if (name.length < 2) return `${fieldName} must be at least 2 characters`;
      if (name.length > 30) return `${fieldName} must be less than 30 characters`;
      if (!/^[a-zA-Z\s]+$/.test(name)) return `${fieldName} can only contain letters and spaces`;
      return '';
    };
  
    const validateEmail = (email) => {
      if (!email) return 'Email is required';
      
      const validDomains = ['kei.edu.in', 'myntra.com','google.com','ibm.in'];
      const emailParts = email.split('@');
      
      if (emailParts.length !== 2) return 'Please enter a valid email address';
      if (!validDomains.includes(emailParts[1])) return `Email must be from one of these domains: ${validDomains.join(', ')}`;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
      
      return '';
    };
  
    const validatePassword = (password) => {
      if (!password) return 'Password is required';
      if (password.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
      if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
      if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
      if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character';
      return '';
    };
  
    const validateConfirmPassword = (confirmPassword, password) => {
      if (!confirmPassword) return 'Please confirm your password';
      if (confirmPassword !== password) return 'Passwords do not match';
      return '';
    };
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
  
      // Real-time validation
      let error = '';
      switch(name) {
        case 'firstName':
          error = validateName(value, 'First name');
          break;
        case 'lastName':
          error = validateName(value, 'Last name');
          break;
        case 'email':
          error = validateEmail(value);
          break;
        case 'password':
          error = validatePassword(value);
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(value, formData.password);
          break;
        default:
          break;
      }
  
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
  
      setValidFields(prev => ({
        ...prev,
        [name]: !error && value !== ''
      }));
    };
    
    const validateForm = () => {
      const firstNameError = validateName(formData.firstName, 'First name');
      const lastNameError = validateName(formData.lastName, 'Last name');
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
  
      const newErrors = {
        firstName: firstNameError,
        lastName: lastNameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      };
  
      setErrors(newErrors);
      return !Object.values(newErrors).some(error => error);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
      
        // Validate the form
        if (validateForm()) {
          fetch("https://sheetdb.io/api/v1/83hri246cxso1")
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch data from the server.");
              }
              return response.json();
            })
            .then((data) => {
              const user = data.find((user) => user.Email === formData.email);
      
              if (user) {
                // User already registered
                alert(`${user["First-Name"]}, you are already registered with this email, ${user["Email"]}`);
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
              } else {
                // Register new user
                console.log("Form submitted:", formData);
                alert("Registration successful!");
      
                const url = "https://sheetdb.io/api/v1/83hri246cxso1";
      
                fetch(url, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    data: [
                      {
                        "First-Name": formData.firstName,
                        "Last-Name": formData.lastName,
                        "Email": formData.email,
                        "Password": formData.confirmPassword,
                      },
                    ],
                  }),
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Failed to register user.");
                    }
                    return response.json();
                  })
                  .then((data) => {
                    console.log(data);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                    });
                  })
                  .catch((error) => {
                    console.error("Error submitting registration:", error);
                    alert("An error occurred during registration. Please try again later.");
                  });
              }
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              alert("An error occurred while checking registration status. Please try again later.");
            });
        } else {
          // Invalid form inputs
          alert("Please correct the highlighted errors in the form.");
        }
      };
      
    const isFormValid = () => {
      return Object.values(validFields).filter(Boolean).length === 5;
    };
    
    return (

    <div className='main-container'>    
      <div className="registration-container">
        <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Registration Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className={`form-input ${errors.firstName ? 'error' : validFields.firstName ? 'valid' : ''}`}
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            {validFields.firstName && <div className="valid-message">First name is valid</div>}
            <div className="requirements">Must contain only letters and spaces</div>
          </div>
  
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              className={`form-input ${errors.lastName ? 'error' : validFields.lastName ? 'valid' : ''}`}
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            {validFields.lastName && <div className="valid-message">Last name is valid</div>}
            <div className="requirements">Must contain only letters and spaces</div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : validFields.email ? 'valid' : ''}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
            {validFields.email && <div className="valid-message">Email is valid</div>}
            <div className="requirements">Must be from kei.edu.in or myntra.com domain</div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : validFields.password ? 'valid' : ''}`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
            {validFields.password && <div className="valid-message">Password meets requirements</div>}
            <div className="requirements">
              Must contain at least 8 characters, one uppercase, one lowercase, one number and one special character
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : validFields.confirmPassword ? 'valid' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            {validFields.confirmPassword && <div className="valid-message">Passwords match</div>}
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={!isFormValid()}
          >
            Register
          </button>
        </form>
      </div>

      </div>
    );
  };
  

