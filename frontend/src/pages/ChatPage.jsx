import { useParams } from "react-router";
import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { toast } from "react-hot-toast";
import CallButton from "../components/CallButton";
import {
    Channel,
    ChannelHeader,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window
} from "stream-chat-react"
import { StreamChat } from "stream-chat"
import ChatLoader from "../components/ChatLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;


const ChatPage = () => {
    const { id:targetUserId } = useParams();

    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    const {authUser} = useAuthUser();
    const {data:tokenData} = useQuery({
        queryKey:["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser // only fetch token if authUser exists
    })

    useEffect(() => {
        const initChat = async () => {
            if(!tokenData?.token || !authUser) return;

            try {
                console.log("Initializing stream chat client...")
                const client = StreamChat.getInstance(STREAM_API_KEY);

                await client.connectUser({
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic
                }, tokenData.token)

                const channelId = [authUser._id, targetUserId].sort().join("-") //To ensure that the same channel is created irrespective of who initiates it
                const currChannel = client.channel("messaging", channelId, {
                    members: [authUser._id, targetUserId]
                })

                await currChannel.watch();
                setChatClient(client);
                setChannel(currChannel);
                setLoading(false);
            } catch (error) {
                console.log("Error in initChat:", error.message);
                toast.error("Failed to initialize chat")
            } finally {
                setLoading(false);
            }
        }

        initChat();
    }, [tokenData, authUser, targetUserId]);

    const handleVideoCall = () => {
        if(channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;
            
            channel.sendMessage({
                text: `I've started a video call. Join me here ${callUrl}`
            })

            toast.success("Video call started successfully")
        }
    }

    if(loading || !chatClient || !channel) return <ChatLoader/>

    return (
        <div className="h-[93vh]">
            <Chat client={chatClient}>
                <Channel channel={channel}>
                    <div className="w-full relative">
                        <CallButton handleVideoCall={handleVideoCall} />
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageInput focus />
                        </Window>
                    </div>

                    <Thread/>
                </Channel>
            </Chat>
        </div>
    )
}

export default ChatPage

