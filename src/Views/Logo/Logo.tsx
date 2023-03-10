import "./Logo.scss";
import { LogoTypeProps } from "../../types/snsType";
import { useNavigate } from "react-router-dom";

const Logo = ({ width, height }: LogoTypeProps) => {
  const navigate = useNavigate();
  const logo = localStorage.getItem("logo");
  return (
    <>
      <span className="logo" onClick={() => navigate("/home")}>
        <img
          src={`${logo}`}
          alt="logo"
          style={{ width: `${width}`, height: `${height}` }}
        />
      </span>
    </>
  );
};

export default Logo;
