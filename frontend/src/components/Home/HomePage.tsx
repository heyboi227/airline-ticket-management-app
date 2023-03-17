import Search from "../Search/Search";
import "./HomePage.scss";

export default function HomePage() {
  return (
    <>
      <div className="landing-page-header">
        <div className="w-50 d-flex flex-column justify-content-start align-items-center">
          <div className="d-flex flex-column justify-content-start align-items-center ms-5 intro-text">
            <h1>Fly with confidence and comfort.</h1>
            <div className="d-flex flex-column justify-content-start align-items-center mt-3">
              <h2>
                With our near-impeccable service, there will not be any lacking
                of these two qualities.
              </h2>
            </div>
          </div>
        </div>
      </div>
      <Search />
    </>
  );
}
