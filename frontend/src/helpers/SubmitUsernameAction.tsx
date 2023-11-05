import { Button, Modal } from "react-bootstrap";

export interface SubmitUsernameActionProperties {
  title: string;
  message: string;
  username: string;
  setUsername: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function SubmitUsernameAction(
  props: Readonly<SubmitUsernameActionProperties>
) {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={true}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.message}</p>
        <div className="form-group mb-3">
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              placeholder="Enter your username"
              value={props.username}
              onChange={(e) => props.setUsername(e.target.value)}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-lg btn-success" onClick={props.onSubmit}>
          Submit
        </Button>
        <Button className="btn btn-lg btn-danger" onClick={props.onCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
