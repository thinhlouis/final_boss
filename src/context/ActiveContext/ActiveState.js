import React, { useState, useCallback, useMemo } from "react";

import ActiveContext from "./ActiveContext";
import session from "../../utils/setStorage";
import activeAPI from "../../apis/activeAPI";
import authAPI from "../../apis/authAPI";

const ActiveState = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const checkedStatusActive = useCallback(async () => {
    try {
      const result = await activeAPI.status();

      if (!result?.data?.success) {
        setShowModal(true);
      }
      setShowModal(false);
    } catch (error) {
      setShowModal(true);
    }
  }, []);

  const handleInactive = useCallback(async () => {
    const status = session.get("status") ?? false;
    if (!status) {
      console.log("Người dùng không đăng nhập!");
      return;
    }
    console.log("Người dùng không hoạt động trong 1 phút. Hiển thị modal.");
    try {
      await activeAPI.change({ isActive: false });
      setShowModal(true);
    } catch (error) {
      setShowModal(true);
    }
  }, []);

  const verifySecurityCode = useCallback(async (inputCode) => {
    try {
      const result = await authAPI.verifyCode({ security_code: inputCode });
      if (result) {
        await activeAPI.change({ isActive: true });
        setShowModal(false);
      }
    } catch (error) {
      setShowModal(true);
      setError(error.response?.data?.message);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      showModal,
      checkedStatusActive,
      handleInactive,
      verifySecurityCode,
      error,
      setError,
    }),
    [showModal, checkedStatusActive, handleInactive, verifySecurityCode, error]
  );

  return (
    <ActiveContext.Provider value={contextValue}>
      {children}
    </ActiveContext.Provider>
  );
};
export default ActiveState;
