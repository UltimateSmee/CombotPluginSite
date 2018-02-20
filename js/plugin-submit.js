$(document).ready(function(f) {
    $("#plform").submit(function(e) {
        e.preventDefault();   
    });
});

//jQuery required thx
function submitPlugin() {
    var form = $("#plform");
    var formVerified = verifyForm();
    if(formVerified) {
        alert("Starting upload");
        uploadForm();
    } else {
        alert("The form is invalid, please try to fix any mistakes present");
    }
}

function uploadForm() {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            //Logged in
            var plName = $("#plname").val();
            var plDesc = $("#pldesc").val();
            var plInfo = $("#plinfo").val();
            var file = $("#jarfile")[0].files[0];
            if(file.size/1024/1024 > 2) {
                alert("File too large. Send me a message and we can talk about it");
                return;
            }
            /*var formData = new FormData();
            formData.append('file',file);
            formData.append('plname',plName);
            formData.append('pldesc', plDesc);
            formData.append('plinfo', plInfo);*/
            var finPath = "userPlugins/" + user.uid + "/plugins/" + plName + "/" + file.name;
            var ref = firebase.storage().ref(finPath);
            ref.put(file).then(function(snap) {
                alert("Upload complete");
                ref.getDownloadURL().then(function(url) {
                    //alert("URL!: " + url); 
                    firebase.database().ref(finPath.replace(file.name, "")).set({
                        downloadUrl:url,
                        pluginName:plName,
                        pluginDesc:plDesc,
                        pluginInfo:plInfo
                    }).then(function(fin) {
                        alert("Plugin set to pending!");
                        location.reload();
                    }).catch(function(err) {
                        alert("Failed to update plugin status, send me a message");  
                    });
                    
                });
                //location.reload();
                //var dbRef = firebase.database().ref("plugins/pending/"+user.uid+"/"+plName);
                //dbRef.set({
                //    downloadLink:
                //});
            }).catch(function(err) {
                alert("Mission failed, we'll get 'em next time: " + err);
                location.reload();
            });
        } else {
            alert("You have to be logged in to do this");
        }
    });
}

function login() {
    var loginProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(loginProvider).then(function(x) {
        if(x) {
            location.reload();
        }
    });
}

function verifyForm() {
    var plName = $("#plname").val();
    var plDesc = $("#pldesc").val();
    var plInfo = $("#plinfo").val();
    var file = $("#jarfile")[0].files[0];
   /*
    alert(plName);
    alert(plDesc);
    alert(plInfo);
    alert(file);*/
    if(plName.trim() !== "" && plDesc.trim() !== "" && plInfo.trim() !== "" && file != null) {
        return true;
    } else {
        return false;
    }
}