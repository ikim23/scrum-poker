import { Button, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { useState, FormEventHandler } from "react";
import { trpc } from "~/utils/trpc";
import { RenderOnClient } from "../RenderOnClient/RenderOnClient";

type CreateRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [name, setName] = useState("");
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const createRoom = trpc.room.createRoom.useMutation();

  const validate = (nextName: string) => {
    if (!nextName) {
      setNameErrorMessage("Name is required");

      return false;
    }

    if (nextName.length > 64) {
      setNameErrorMessage("Name cannot be longer than 64 characters");

      return false;
    }

    setNameErrorMessage("");

    return true;
  };

  const handleClose = () => {
    setName("");
    setNameErrorMessage("");
    onClose();
  };

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();

    if (validate(name)) {
      createRoom.mutate({ name }, { onSuccess: handleClose });
    }
  };

  return (
    <RenderOnClient>
      <Modal show={isOpen} onClose={handleClose} position="center">
        <Modal.Header className="bg-gray-500">Create Room</Modal.Header>
        <form noValidate onSubmit={handleSubmit}>
          <Modal.Body className="bg-gray-500">
            <div className="mb-2">
              <Label htmlFor="name">Name</Label>
            </div>
            <TextInput
              id="name"
              type="text"
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                validate(event.target.value);
              }}
              onBlur={() => {
                validate(name);
              }}
              color={nameErrorMessage ? "failure" : undefined}
              helperText={nameErrorMessage}
            />
          </Modal.Body>
          <Modal.Footer className="bg-gray-500">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Create</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </RenderOnClient>
  );
}
