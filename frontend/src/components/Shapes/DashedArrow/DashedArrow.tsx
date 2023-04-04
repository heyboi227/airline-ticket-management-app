import "./DashedArrow.scss";

const DashedArrow: React.FC = () => {
  return (
    <div className="dashed-arrow-container">
      <svg
        className="dashed-arrow"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0,5 L 100,5"
          strokeLinecap="round"
          strokeWidth="2"
          strokeDasharray="5,5"
          stroke="currentColor"
        ></path>
        <path
          d="M 95,1 L 100,5 L 95,9"
          strokeLinecap="round"
          strokeWidth="2"
          stroke="currentColor"
        ></path>
      </svg>
    </div>
  );
};

export default DashedArrow;
