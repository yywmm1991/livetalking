var offerOptions = {
 offerToReceiveAudio: 1,
 offerToReceiveVideo: 1
};

var localStream;
var remoteVideo=document.getElementById('remote');
var localVideo=document.getElementById('local');




//start
navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(data => {
 console.log(data);
 localVideo.srcObject=data; // drawing video from camera directly to video element
 localStream=data

 // get ref to video and audio tracks
 var videoTracks = localStream.getVideoTracks();
 var audioTracks = localStream.getAudioTracks();

 // create two peers
 var pc1 = new webkitRTCPeerConnection(null);
 var pc2 = new webkitRTCPeerConnection(null);


 pc1.onicecandidate = function(e) {
  if (e.candidate) {
    console.log('made connection to peer 1', e);
    pc2.addIceCandidate(new RTCIceCandidate(e.candidate)).then(out => console.log(out), err => console.log(1, err));
  }
 };
 pc2.onicecandidate = function(e) {
   if (e.candidate) {
     console.log('made connection to peer 2', e);
     pc1.addIceCandidate(new RTCIceCandidate(e.candidate)).then(out => console.log(out), err => console.log(1, err));
   }
 };

 // when there's data on the stream, put it in the 2nd video player
 pc2.onaddstream = function(e) {
   console.log("p2 onaddstream")
   remoteVideo.srcObject = e.stream;
 }
//console.log(pc1);

// write the data contained in localStream to the peer pc1
pc1.addStream(localStream);

// handshaking step
pc1.createOffer(offerOptions).then(offerDesc => { // 1. create offer
 console.log("DESC", offerDesc.sdp)
 // desc.sdp would be sent to the other peer, and decoded back to desc (with RTCSessionDescription)

 // 2. add the offer to both peers
 pc1.setLocalDescription(offerDesc).then(out => console.log(out), err => console.log(1, err));
 pc2.setRemoteDescription(offerDesc).then(out => console.log(out), err => console.log(1, err));

 // 3. Create an answer to the offer
 pc2.createAnswer().then(answerDesc => {
   console.log("createAnswer")

   // 4. add answer to both peers again
   pc2.setLocalDescription(answerDesc).then(out => console.log(out), err => console.log(1, err));
   pc1.setRemoteDescription(answerDesc).then(out => console.log(out), err => console.log(1, err));

 }, err => {
   console.log("an error", err)
 });
});
});



//call
//   pc.addStream(data);
//   pc.createOffer(function(descriptor){
//     pc.setLocalDescription(descriptor);
//     console.log("Got Offer!!");
// })























// $(document).ready(function(){
// $("#printQuote").click(function(){
//
//
// pc.onaddstream = function(obj) {
//   var vid = document.createElement("video");
//   document.appendChild(vid);
//   vid.srcObject = obj.stream;
//   console.log("Hi");
// }
//
// // Helper functions
// function endCall() {
//   var videos = document.getElementsByTagName("video");
//   for (var i = 0; i < videos.length; i++) {
//     videos[i].pause();
//   }
//
//   pc.close();
// }
//
// function error(err) {
//   endCall();
// }
//
// });
//
// });
//
//
//
//
//
//
//
//
//
// //   navigator.getUserMedia = navigator.getUserMedia ||
// //                            navigator.webkitGetUserMedia ||
// //                            navigator.mozGetUserMedia;
// //
// //   if (navigator.getUserMedia) {
// //      navigator.getUserMedia({ audio: true, video: { width: 1280, height: 720 } },
// //         function(stream) {
// //            var video = document.querySelector('video');
// //            video.src = window.URL.createObjectURL(stream);
// //            console.log(video.src);
// //            video.onloadedmetadata = function(e) {
// //              video.play();
// //            };
// //         },
// //         function(err) {
// //            console.log("The following error occurred: " + err.name);
// //         }
// //      );
// //   } else {
// //      console.log("getUserMedia not supported");
// //   }
// // });
// //  });