import "./Footer.scss";
import { getYear } from "../../helpers/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <div className="container-fluid bg-dark text-white">
      <div className="container d-flex justify-content-center">
        <div className="row w-75 mt-4 mb-4">
          <div className="col">
            <h1>Company</h1>
            <ul className="list-unstyled">
              <li>About us</li>
              <li>Our fleet</li>
              <li>Staff</li>
              <li>Careers</li>
            </ul>
          </div>
          <div className="col">
            <h1>Services</h1>
            <ul className="list-unstyled">
              <li>Lost baggage</li>
              <li>Office locations</li>
              <li>Miles & benefits</li>
            </ul>
          </div>
          <div className="col">
            <h1>Support</h1>
            <ul className="list-unstyled">
              <li>Contact us</li>
              <li>File a claim</li>
            </ul>
          </div>
          <div className="col social">
            <h1>Social media</h1>
            <div className="d-flex social-media justify-content-between">
              <FontAwesomeIcon icon={faTwitter} />
              <FontAwesomeIcon icon={faFacebook} />
              <FontAwesomeIcon icon={faInstagram} />
              <FontAwesomeIcon icon={faYoutube} />
            </div>
          </div>
        </div>
      </div>
      <span>&copy; {getYear()} by Miloš Jeknić</span>
    </div>
  );
}
