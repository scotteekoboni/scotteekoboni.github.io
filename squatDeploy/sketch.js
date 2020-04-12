let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = '';
let counter = '0';
let holderLabel = '';
let gateKeeper = 'closed';

let ankleErr = '';

let startCnd = 'off';

let state = 'waiting';
let targetLabel;


function keyPressed() {
  if (key == 't') {
    brain.normalizeData();
    brain.train({epochs: 50}, finished); 
  } else if (key == 's') {
    brain.saveData();
  } else {
    targetLabel = key;
    console.log(targetLabel);
    setTimeout(function() {
      console.log('collecting');
      state = 'collecting';
      setTimeout(function() {
        console.log('not collecting');
        state = 'waiting';
      }, 5000);
    }, 2000);
  }
}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
  //  var messenger = document.getElementById('txt').value;
  // if (messenger == 0) {
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);

    let options = {
      inputs: 34,
      outputs: 3,
      task: 'classification',
      debug: true
    }
    brain = ml5.neuralNetwork(options);

    // LOAD PRETRAINED MODEL
    const modelInfo = {
      model: 'model.json',
      metadata: 'model_meta.json',
      weights: 'model.weights.bin',
    };
    brain.load(modelInfo, brainLoaded);
}
// else {
  //   setTimeout(setup, 100);
  // }

  // LOAD TRAINING DATA
  // brain.loadData('squat_jack.json', dataReady);


function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}



function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {


  // console.log(results);
  // gateKeeper = "closed";
  if (results[0].confidence > 0.5) {
    if (results[0].label == "n") {
      holderLabel = "Normal";
      gateKeeper = "opened";
      
    } else if (results[0].label == "q") {
      holderLabel = "Squat";
     
    }
    
    if (holderLabel == "Squat" && gateKeeper == "opened" && startCnd == "on") {
      counter++
      gateKeeper = "closed";
    }
  
  }
  classifyPose();
  bodyCheck();
  // console.log("____________");
  // console.log(pose.keypoints[15].score);
  // console.log(pose.keypoints[16].score);
  // console.log("____________");
  // console.log(results[0]);
  // console.log(holderLabel);
  poseLabel = holderLabel;
}

function dataReady() {
  brain.normalizeData();
  brain.train({
    epochs: 50
  }, finished);
}

function finished() {
  console.log('model trained');
  brain.save();
  classifyPose();
}


function bodyCheck() {
  for (let i = 0; i < pose.keypoints.length; i++) {
    // console.log(pose.keypoints[i].score);
    if (pose.keypoints[i].score < 0.015 ) {
      ankleErr = "Make Sure Your Whole Body Can Be Seen";
      gateKeeper = "closed";
    } else {
      ankleErr = "";
    }
  }
}

function starting() {
  startCnd = 'on';
}

function stopping() {
  startCnd = 'display';
  document.getElementById("results").innerHTML = "Congrats <br> Your Score: " + counter + " Squats!";
}
  
  function resetting() {
    counter = "0";
    startCnd = 'reset'
    document.getElementById("results").innerHTML = "";
  }


function gotPoses(poses) {
  // console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == 'collecting') {
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      let target = [targetLabel];
      brain.addData(inputs, target);
    }
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();
  
  if (startCnd == 'on') {
    fill(255, 0, 255);
    noStroke();
    textSize(50);
    textAlign(RIGHT);
    text(poseLabel, width/4, height/5);
    textSize(75);
    text(counter, width/5, height/3);
    fill(255, 0, 0);
    textSize(25);
    text(ankleErr, width/1.15, height/2);
  }
}