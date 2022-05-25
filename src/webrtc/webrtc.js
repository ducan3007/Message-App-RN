import { getDoc } from "firebase/firestore";
import { RTCPeerConnection, mediaDevices, RTCIceCandidate, RTCSessionDescription } from "react-native-webrtc";
import { db, collection, onSnapshot, doc, setDoc, addDoc, updateDoc } from "../../firebase";

const config = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};
let onCallerUnsubscribe;
let onSnapshotRoomRef;
let onSnapshotCalle;

export const unSubcribeSnapshot = async () => {
  if (onCallerUnsubscribe) {
    await onCallerUnsubscribe();
  }
  if (onSnapshotCalle) {
    await onSnapshotCalle();
  }
  if (onSnapshotRoomRef) {
    await onSnapshotRoomRef();
  }
};
export const startLocalStream = async (setLocalStream) => {
  try {
    const devices = await mediaDevices.enumerateDevices();

    const videoSourceId = devices.find((device) => device.kind === "videoinput" && device.facing === "front");

    const streamConfig = {
      audio: true,
      video: {
        facingMode: "user",
        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      },
    };
    const stream = await mediaDevices.getUserMedia(streamConfig);

    setLocalStream(stream);
  } catch (error) {
   
  }
};

export const startCall = async (roomId, localStream, remoteStream, setRemoteStream, setCachedLocalPC) => {
  try {
    const Local = new RTCPeerConnection(config);

    Local.addStream(localStream);

    const roomRef = doc(db, "calls", roomId);

    const callerRef = collection(db, "calls", roomId, "callers");
    const calleRef = collection(db, "calls", roomId, "callee");

    Local.onicecandidate = async (e) => {
  
      if (!e.candidate) {
        return;
      }
      await addDoc(callerRef, e.candidate.toJSON());
    };
    Local.onaddstream = (e) => {
      if (e.stream && remoteStream !== e.stream) {
        setRemoteStream(e.stream);
      }
    };

    const offer = await Local.createOffer();

    await Local.setLocalDescription(offer);
    const RoomOffer = { offer };
    await setDoc(roomRef, RoomOffer);

    onSnapshotRoomRef = onSnapshot(roomRef, async (snapshot) => {
      const data = snapshot.data();
      if (!Local.currentRemoteDescription && data.answer) {
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await Local.setRemoteDescription(rtcSessionDescription);
      }
    });
    onSnapshotCalle = onSnapshot(calleRef, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        try {
          if (change.type === "added") {
            let data = change.doc.data();
            await Local.addIceCandidate(new RTCIceCandidate(data));
          }
        } catch (error) {
          
        }
      });
    });
    setCachedLocalPC(Local);
  } catch (error) {
   
  }
};

export const joinCall = async (roomId, localStream, remoteStream, setRemoteStream, setCachedLocalPC) => {
  try {
    const roomRef = doc(db, "calls", roomId);

    const roomSnapShot = await getDoc(roomRef);

    if (!roomSnapShot.exists) return;
    const Local = new RTCPeerConnection(config);
    Local.addStream(localStream);

    const calleeRef = collection(db, "calls", roomId, "callee");

    Local.onicecandidate = async (e) => {
      if (!e.candidate) {
        return;
      }
      await addDoc(calleeRef, e.candidate.toJSON());
    };
    Local.onaddstream = (e) => {
      if (e.stream && remoteStream !== e.stream) {
        setRemoteStream(e.stream);
      }
    };

    const offer = roomSnapShot.data().offer;

    await Local.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await Local.createAnswer();

    await Local.setLocalDescription(answer);

    const roomAnswer = { answer };

    await updateDoc(roomRef, roomAnswer);

    onCallerUnsubscribe = onSnapshot(collection(db, "calls", roomId, "callers"), (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          await Local.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    setCachedLocalPC(Local);
  } catch (error) {
    console.log("joinCall Erro : \n", error);
  }
};
