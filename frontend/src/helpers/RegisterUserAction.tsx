import { Button, Modal } from "react-bootstrap";

export interface RegisterUserActionProperties {
  title: string;
  message: string;
  onSubmit: () => void;
}

export default function RegisterUserAction(
  props: Readonly<RegisterUserActionProperties>
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
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-lg btn-success" onClick={props.onSubmit}>
          Register
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
