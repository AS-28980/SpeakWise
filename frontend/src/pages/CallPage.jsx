import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import PageLoader from "../components/PageLoader";
import { toast } from "react-hot-toast";

import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    CallControls,
    SpeakerLayout,
    StreamTheme,
    CallingState,
    useCallStateHooks
} from "@stream-io/video-react-sdk"

import "@stream-io/video-react-sdk/dist/css/styles.css"

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
    const {id:callId} = useParams();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);

    const {authUser, isLoading} = useAuthUser();

    const { data:tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser
    })

    useEffect(() => {

        const initCall = async () => {
            if(!tokenData.token || !authUser || !callId) return;

            try {
                console.log("Initializing stream call client...")

                const user = {
                    id: authUser._id,
                    name: authUser.fullName,
                    image:authUser.profilePic
                }

                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.token
                })

                const callInstance = videoClient.call("default", callId)

                await callInstance.join({create:true})

                console.log("Call joined successfully")

                setClient(videoClient)
                setCall(callInstance)
            } catch (error) {
                console.log("Error joining call", error)
                toast.error("Failed to join call. Please try again.")
            } finally {
                setIsConnecting(false)
            }
        }

        initCall();
    }, [tokenData, authUser, callId])

    if(isLoading || isConnecting) return <PageLoader/>

    
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="relative">
                {client && call ? (
                    <StreamVideo client={client}>
                        <StreamCall call={call}>
                            <CallContent />
                        </StreamCall>
                    </StreamVideo>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p>Could not initialize call. Please refresh or try again later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const CallContent = () => {
    const {useCallCallingState} = useCallStateHooks();
    const callingState = useCallCallingState();
    const navigate = useNavigate();
    const {id:callId} = useParams();
    const {authUser} = useAuthUser();

    // Extract the other user's ID from the channel ID format
    if(callingState === CallingState.LEFT) {
        const [id1, id2] = callId.split("-");
        const otherUserId = authUser._id === id1 ? id2 : id1;
        return navigate(`/chat/${otherUserId}`);
    }

    return (
        <StreamTheme>
            <SpeakerLayout />
            <CallControls />
        </StreamTheme>
    )
}

export default CallPage
