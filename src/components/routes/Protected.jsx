import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading) {
    return null;
  }
  return <>{user ? children : <Navigate to="/" />}</>;
};

export default Protected;

Protected.propTypes = {
  children: PropTypes.node.isRequired,
};
