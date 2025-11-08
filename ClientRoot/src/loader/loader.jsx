import "./loader.css";

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>
    </div>
  );
}

export default Loader;
