import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserVerification = () => {
  const { verificationToken } = useParams();
  const [verificationStatus, setVerificationStatus] = useState("Verifying...");

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/verify/${verificationToken}`
        );

        if (res.status === 200) {
          setVerificationStatus("Email verification successful.");
        }
      } catch (error) {
        setVerificationStatus("Invalid verification token.");
      }
    };

    verifyUser();
  }, [verificationToken]);

  return (
    <div>
      <h2>{verificationStatus}</h2>
    </div>
  );
};

export default UserVerification;
