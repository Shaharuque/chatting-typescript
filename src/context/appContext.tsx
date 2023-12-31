import { io } from "socket.io-client";
import React from "react";
// const SOCKET_URL = "http://localhost:8080";
// export const socket = io(SOCKET_URL);
// app context
export const AppContext = React.createContext({
    // socket: socket,
    rooms: [],
    currentRoom: [],
    members: [],
    messages: [],
    privateMemberMsg: {},
    newMessages: {},
    setRooms: (rooms:any) => { },
    setCurrentRoom: (currentRoom:any) => { },
    setMembers: (members:any) => { },
    setMessages: (messages:any) => { },
    setPrivateMemberMsg: (privateMemberMsg:any) => { },
    setNewMessages: (newMessages:any) => { },
    })
    ;