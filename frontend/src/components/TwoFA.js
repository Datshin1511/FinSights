import React, { useState, useRef } from 'react';
import '../styles/twofa.css'; // Ensure you have your styles defined here

const OtpVerification = ({ handleVerify, handleResend, error, success }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify(otp.join(''));
  };

  return (
    <div className='container'>
      <div className="otp-Form">
        <h2 className="mainHeading">Two-Factor Authentication</h2>
        <p className="otpSubheading">Please enter the OTP sent to your phone.</p>
        <form onSubmit={handleSubmit}>
          {/* OTP Input Fields */}
          <div className="inputContainer">
            {otp.map((digit, index) => (
              <input
                key={index}
                required
                maxLength="1"
                type="text"
                className="otp-input"
                id={`otp-input${index + 1}`}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => inputs.current[index] = el}
              />
            ))}
          </div>
          <button className="verifyButton" type="submit">Verify</button>
          <p className="resendNote">
            Didn't receive the code? 
            <button type="button" className="resendBtn" onClick={handleResend}>Resend Code</button>
          </p>
          {error && <p className='text-danger my-2'>{error}</p>}
          {success && <p className='text-success my-2'>{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
