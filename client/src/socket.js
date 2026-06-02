import { io }
from "socket.io-client";

const socket = io(
  "http://54.90.194.227:5000"
);

export default socket;