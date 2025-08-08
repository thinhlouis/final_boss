import userAPI from "../../apis/userAPI";
import ResetPasswordForm from "./ResetPasswordForm";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [isValid, setIsValid] = useState(null);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);
  const [tokenParams] = useSearchParams();
  const navigate = useNavigate();

  const token = tokenParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    const checkAccess = async () => {
      try {
        const response = await userAPI.verifyReset(token);
        setIsValid(true);
        setNotification(response?.data?.message);
      } catch (error) {
        setIsValid(false);
        setNotification(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [token, navigate]);

  if (isValid === false)
    return (
      <div className="expired">
        <p>{notification}</p>
      </div>
    );
  return <ResetPasswordForm token={token} loading={loading} />;
}
