import { Layout } from "~/components/Layout/Layout";
import { api } from "~/utils/api";
import { Button, Spinner } from "flowbite-react";
import { RoomList } from "~/components/RoomList/RoomList";
import { CreateRoomModal } from "~/components/CreateRoomModal/CreateRoomModal";
import { useState } from "react";

export default function Rooms() {
  const trpcContext = api.useContext();
  const rooms = api.room.getRooms.useQuery();
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  return (
    <Layout>
      <h1 className="mb-4 text-3xl">Your Rooms</h1>
      {rooms.isLoading && <Spinner />}
      {rooms.isSuccess && <RoomList rooms={rooms.data} />}
      <Button
        className="mt-4"
        onClick={() => {
          setIsCreateRoomModalOpen(true);
        }}
      >
        Create Room
      </Button>
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => {
          setIsCreateRoomModalOpen(false);
          void trpcContext.room.getRooms.invalidate();
        }}
      />
    </Layout>
  );
}
