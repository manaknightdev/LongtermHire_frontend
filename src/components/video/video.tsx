import { useState, useEffect } from "react";
import TwilioVideo from "twilio-video";
import VideoItem from "./videoItem";

function Video() {
  const [room, setRoom] = useState(null) as any;
  const [roomName, setRoomName] = useState("room");
  const [userName, setUserName] = useState("room");
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleTabClose = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      document.getElementById("local-participant") &&
        (document.getElementById("local-participant")!.style.display = "none");
      document.getElementById("remote-participant") &&
        (document.getElementById("remote-participant")!.style.display = "none");
      document.getElementById("leave-btn") &&
        (document.getElementById("leave-btn")!.style.display = "none");
      return room && room?.disconnect();
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      room && room.disconnect();
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [room]);

  const startMeeting = async () => {
    try {
      setError("");

      function participantDisconnected(
        _participant?: TwilioVideo.RemoteParticipant | undefined,
        _room?: TwilioVideo.Room | undefined
      ) {
        document.getElementById("remote-participant") &&
          (document.getElementById("remote-participant")!.style.display =
            "none");
      }

      function trackPublished(
        publication: {
          track: any;
          on: (arg0: string, arg1: (track: any) => void) => void;
        },
        _participant: any
      ) {
        // If the TrackPublication is already subscribed to, then attach the Track to the DOM.
        if (publication.track) {
          if (publication?.track && publication?.track?.kind === "video")
            setVideo(publication.track);
          else setAudio(publication.track);
        }

        // Once the TrackPublication is subscribed to, attach the Track to the DOM.
        publication.on("subscribed", (track: { kind: string }) => {
          if (track.kind === "video") setVideo(publication.track);
          else setAudio(publication.track);
          document.getElementById("local-participant") &&
            (document.getElementById("local-participant")!.style.display =
              "block");
          document.getElementById("remote-participant") &&
            (document.getElementById("remote-participant")!.style.display =
              "block");
          document.getElementById("leave-btn") &&
            (document.getElementById("leave-btn")!.style.display = "block");
        });
      }

      function participantConnected(
        participant: TwilioVideo.RemoteParticipant,
        _room: TwilioVideo.Room
      ) {
        // Handle the TrackPublications already published by the Participant.
        participant.tracks.forEach((publication: any) => {
          trackPublished(publication, participant);
        });

        // Handle theTrackPublications that will be published by the Participant later.
        participant.on("trackPublished", (publication: any) => {
          trackPublished(publication, participant);
        });
      }

      const res = await fetch(
        "http://localhost:3048/v2/api/lambda/video/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identity: userName + Math.random().toFixed(2),
            room: roomName,
          }),
        }
      );
      const roomInfo = await res.json();

      const connectOptions: any = {
        // Available only in Small Group or Group Rooms only. Please set "Room Type"
        // to "Group" or "Small Group" in your Twilio Console:
        // https://www.twilio.com/console/video/configure
        bandwidthProfile: {
          video: {
            dominantSpeakerPriority: "high",
            mode: "collaboration",
            clientTrackSwitchOffControl: "auto",
            contentPreferencesMode: "auto",
          },
        },

        // Available only in Small Group or Group Rooms only. Please set "Room Type"
        // to "Group" or "Small Group" in your Twilio Console:
        // https://www.twilio.com/console/video/configure
        dominantSpeaker: true,

        // Comment this line if you are playing music.
        maxAudioBitrate: 16000,

        // VP8 simulcast enables the media server in a Small Group or Group Room
        // to adapt your encoded video quality for each RemoteParticipant based on
        // their individual bandwidth constraints. This has no utility if you are
        // using Peer-to-Peer Rooms, so you can comment this line.
        preferredVideoCodecs: [{ codec: "VP8", simulcast: true }],

        // Capture 720p video @ 24 fps.
        video: { height: 720, frameRate: 24, width: 1280 },
      };

      const dvcs = await navigator.mediaDevices.enumerateDevices();
      const audioDevice = dvcs.filter(
        (dvc) => dvc.kind === "audioinput"
      ) as any;
      const videoDevice = dvcs.filter(
        (dvc) => dvc.kind === "videoinput"
      ) as any;

      connectOptions.audio = {
        deviceId: {
          exact: audioDevice.deviceId,
        },
      };

      // Add the specified Room name to ConnectOptions.
      connectOptions.name = roomName;

      // Add the specified video device ID to ConnectOptions.
      connectOptions.video.deviceId = {
        exact: videoDevice.deviceId,
      };

      const room = await TwilioVideo.connect(roomInfo.data, connectOptions);
      setRoom(room);
      document.getElementById("local-participant") &&
        (document.getElementById("local-participant")!.style.display = "block");
      document.getElementById("leave-btn") &&
        (document.getElementById("leave-btn")!.style.display = "block");

      // Subscribe to the media published by RemoteParticipants already in the Room.
      room.participants.forEach((participant) => {
        participantConnected(participant, room);
      });

      // Subscribe to the media published by RemoteParticipants joining the Room later.
      room.on("participantConnected", (participant) => {
        participantConnected(participant, room);
      });

      room.on("participantDisconnected", (participant) => {
        participantDisconnected(participant, room);
      });

      room.on("disconnected", (_room: any, _error: any) => {
        participantDisconnected();
      });
    } catch (err: any) {
      if (err.message === "Room contains too many Participants")
        setError("Room contains too many Participants.");
      else setError("Something went wrong.");
      document.getElementById("start-btn") &&
        (document.getElementById("start-btn")!.style.display = "block");
      console.error(err);
    }
  };

  return (
    <>
      <div className="mb-10 flex justify-center gap-10">
        <input
          type="text"
          placeholder="User Name"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Room Name"
          onChange={(e) => {
            setRoomName(e.target.value);
          }}
        />
        <button
          className="btn bg-green-400 font-bold"
          id="start-btn"
          onClick={(e: any) => {
            e.target.style.display = "none";
            startMeeting();
          }}
        >
          Start
        </button>
      </div>
      {error && (
        <div className="js__error text-center text-2xl text-red-400">
          {error + " Please try again later!"}
        </div>
      )}
      {/*  Array.from(room.localParticipant.videoTracks.values())?.[0]
                  ?.track
                  
                     Array.from(room.localParticipant.audioTracks.values())?.[0]
                  ?.track
                  */}
      {room && (
        <div className="mx-auto flex w-1/2 flex-col gap-3">
          <div id="local-participant">
            <VideoItem muted={true} videoStream={video} audioStream={audio} />
          </div>
          {audio && video && (
            <div id="remote-participant">
              <VideoItem
                muted={false}
                videoStream={video}
                audioStream={audio}
              />
            </div>
          )}
          <button
            id="leave-btn"
            className="btn bg-red-400 font-bold"
            onClick={(e: any) => {
              room.disconnect();
              document.getElementById("local-participant") &&
                (document.getElementById("local-participant")!.style.display =
                  "none");
              document.getElementById("remote-participant") &&
                (document.getElementById("remote-participant")!.style.display =
                  "none");
              e.target.style.display = "none";
              document.getElementById("start-btn")!.style.display = "block";
            }}
          >
            Leave
          </button>
        </div>
      )}
    </>
  );
}

export default Video;
