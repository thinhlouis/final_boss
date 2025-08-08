import authAPI from "../../apis/authAPI";
import { session } from "../../utils/setStorage";

import { useState, useEffect, useRef } from "react";

export default function SecurityDashBoard({ children }) {
  const [validated, setValidated] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const timeRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const valid = session.get("validated");
    const timeExpires = 1000 * 60 * 100;

    if (!valid) {
      setValidated(false);
      return;
    }
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    setValidated(true);
    timeRef.current = setTimeout(() => {
      session.remove("validated");
      setValidated(false);
    }, timeExpires);
  }, [validated]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [validated]);

  const verifyCode = async (code) => {
    if (!code) {
      setError("Missing input data!");
      return;
    }
    try {
      await authAPI.verifyCode({ security_code: code });
      setValidated(true);
      setCode("");
      session.set("validated", true);
    } catch (error) {
      setError(error.response?.data?.message);
      setValidated(false);
    }
  };
  const handleValidated = async (e) => {
    e.preventDefault();
    await verifyCode(code);
  };
  return validated ? (
    children
  ) : (
    <div className="security_dashboard">
      <form className="enter-code-valid" onSubmit={handleValidated}>
        <label htmlFor="enter-code-valid">Plesae enter code</label>
        <input
          ref={inputRef}
          type="password"
          id="enter-code-valid"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {error && <p className="error">{error}</p>}

        <button type="submit">Verify code</button>
      </form>
    </div>
  );
}
