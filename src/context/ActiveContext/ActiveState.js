import React, { useState, useCallback, useMemo } from "react";

import ActiveContext from "./ActiveContext";
import { session } from "../../utils/setStorage";
import userAPI from "../../apis/userAPI";
import authAPI from "../../apis/authAPI";

const ActiveState = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const checkedStatusActive = useCallback(async () => {
    try {
      const result = await userAPI.status();

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
      await userAPI.change({ isActive: false });
      setShowModal(true);
    } catch (error) {
      setShowModal(true);
    }
  }, []);

  const verifySecurityCode = useCallback(async (inputCode) => {
    try {
      const result = await authAPI.verifyCode({ security_code: inputCode });
      if (result) {
        await userAPI.change({ isActive: true });
        setShowModal(false);
        return true;
      }
    } catch (error) {
      setShowModal(true);
      setError(error.response?.data?.message);
      return false;
    }
  }, []);

  const verifyMembership = useCallback(async (id) => {
    try {
      const result = await userAPI.vipMember(id);
      if (result.data.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setError(error.response?.data?.message);
      return false;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      showModal,
      checkedStatusActive,
      handleInactive,
      verifySecurityCode,
      verifyMembership,
      setShowModal,
      error,
      setError,
    }),
    [
      showModal,
      setShowModal,
      checkedStatusActive,
      handleInactive,
      verifySecurityCode,
      verifyMembership,
      error,
    ]
  );

  return (
    <ActiveContext.Provider value={contextValue}>
      {children}
    </ActiveContext.Provider>
  );
};
export default ActiveState;
