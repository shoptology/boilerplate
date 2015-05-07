// Prevent page from scrolling.
document.addEventListener("touchmove", function(e) { e.preventDefault(); });

window.GalleryController = {

  index: function() {
    // Initiate the gallery view and preload it
    var galleryView = new steroids.views.WebView("/views/photoGalleryExample/show.html");
    document.addEventListener("deviceready", onDeviceReady);

    steroids.view.navigationBar.show("Gallery Example");
    showGalleryButton();
    
    function onDeviceReady() {
      // Cordova triggers deviceready after DOMContentLoaded, so we are safe to find our element
      var takePicButton = document.querySelector("#take-picture");
      
      // User Hammer.js to handle the tap action
      Hammer(takePicButton).on("tap", function(){
        takePictureWithCamera();
      });
    }
    
    function showGalleryButton() {
      // Set up our right button
      var rightButton = new steroids.buttons.NavigationBarButton();
      rightButton.title = "Gallery";
      rightButton.onTap = function() {
        steroids.layers.push(galleryView);
      };

      // Display it on the navigation bar
      steroids.view.navigationBar.setButtons({
        right: [rightButton]
      });
    }
    
    
    // Camera callback chain starts
    function takePictureWithCamera() {
      navigator.camera.getPicture(imageReceived, cameraError, { quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true,
        targetWidth: 1000
      });
    }

    // Cordova stores photos in the tmp folder by default, 
    // so we should move it to the user files folder
    function imageReceived(imageURI) {
      moveFileToPermStorage(imageURI);
      steroids.layers.push(galleryView);
    }
    
    // File move callback chain starts
    function moveFileToPermStorage(fileURI) {
      window.resolveLocalFileSystemURI(fileURI, gotFileObject, fileError);
    }
    
    function gotFileObject(file){
      // Define a target directory for our file in the user files folder
      var targetDirURI = "file://" + steroids.app.absoluteUserFilesPath
      var uniqueName = "gallery_pic.png";
      
      // Move our image into the target directory
      window.resolveLocalFileSystemURI(targetDirURI, function(directory) { 
        file.moveTo(directory, uniqueName, fileMoved, fileError);
      }, fileError);
    }
    
    // Store the moved file's URL into localStorage
    function fileMoved(file) {
      // localhost serves files from both steroids.app.userFilesPath and steroids.app.path
      localStorage["gallery.pic.1"] = "http://localhost/" + file.name;
    }
    
    // Error callbacks
    function cameraError(message) {
      navigator.notification.alert(message, null, "Camera error!");
    }
    
    function fileError(error) {
      navigator.notification.alert("Cordova error code: " + error.code, null, "File system error!");
    }
    
  },
  
  gallery: function() {
    
    steroids.view.navigationBar.show("Gallery ");
    
    document.addEventListener("DOMContentLoaded", function() {
      populateGallery();
    });

    function populateGallery() {
      // Only populate gallery if there's an image URL in localStorage
      if (localStorage["gallery.pic.1"]) {
        
        var img = document.createElement("img");
        
        // Read the src URL from localStorage and add a unique string to fix WebKit image caching
        img.setAttribute("src", localStorage["gallery.pic.1"] + "?" + (new Date()).getTime());
        document.querySelector("#gallery-container").appendChild(img);
      
        // Hide the placeholder text
        document.querySelector("#placeholder-text").style.display = "none";
      }
    }
    
  }
  
}
