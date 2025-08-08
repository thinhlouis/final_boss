const validatedRole = async (role) => {
  if (role !== "super_root") return false;
  return true;
};

export default validatedRole;
