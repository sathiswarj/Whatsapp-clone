import {io, Socket} from 'socket.io-client';

const SERVER_URL = "http://192.168.29.174:4000"

let socket : Socket | null =  null;

export const connectSocket  = (userId: string, onConnect?:() => void) => {
    console.log("Connecting socket...")
    if(socket && socket.connected){
        console.log("Already connected");
        return
    }
    socket =  io(SERVER_URL,{
        auth: {userId},
        transports: ["websocket"],
        forceNew: true,
        reconnection: true
    })

    socket.on("connect", () =>{
        console.log("Socket connected", socket.id)
        socket?.emit("join", userId);
        onConnect?.()
    })
    socket.on("connect_error",(err) =>{
        console.log("Connection error", err.message)
    })
    

}


export const getSocket = () : Socket | null => socket