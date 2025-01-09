// DOM Elements
const uploadBtn = document.getElementById("uploadBtn");
const cropBtn = document.getElementById("cropBtn");
const resizeBtn = document.getElementById("resizeBtn");
const rotateBtn = document.getElementById("rotateBtn");
const flipBtn = document.getElementById("flipBtn");
const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");
const saturationSlider = document.getElementById("saturation");
const zoomSlider = document.getElementById("zoom");
const imageCanvas = document.getElementById("imageCanvas");
const ctx = imageCanvas.getContext("2d");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const prevBtn = document.getElementById("prevBtn");
const layerList = document.getElementById("layerList");
const historyList = document.getElementById("historyList");

let img = new Image();
let imageData;
let history = [];
let layers = [];
let zoomLevel = 1;
let currentLayer = 0;
let cropping = false;
let cropStartX = 0, cropStartY = 0, cropWidth = 0, cropHeight = 0;

// File Upload
uploadBtn.addEventListener("click", function () {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", function (event) {
        const reader = new FileReader();
        reader.onload = function () {
            img.src = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    });
    fileInput.click();
});

// When Image Loads, Draw it to Canvas
img.onload = function () {
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, img.width, img.height);
    addHistory("Image uploaded");
    addLayer("Background Layer");
};

// Apply Zoom
zoomSlider.addEventListener("input", function () {
    zoomLevel = zoomSlider.value;
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    ctx.save();
    ctx.scale(zoomLevel, zoomLevel);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
});

// Add Layer to Layer Panel
function addLayer(layerName) {
    layers.push(layerName);
    const layerItem = document.createElement("li");
    layerItem.textContent = layerName;
    layerItem.addEventListener("click", function () {
        selectLayer(layers.indexOf(layerName));
    });
    layerList.appendChild(layerItem);
}

// Select Layer from Layer Panel
function selectLayer(index) {
    currentLayer = index;
    const layerItems = layerList.getElementsByTagName("li");
    for (let i = 0; i < layerItems.length; i++) {
        layerItems[i].classList.remove("active");
    }
    layerItems[currentLayer].classList.add("active");
    // Implement logic to show the selected layer
}

// Add History to History Panel
function addHistory(action) {
    history.push(action);
    const historyItem = document.createElement("li");
    historyItem.textContent = action;
    historyItem.addEventListener("click", function () {
        alert(action + " clicked");
    });
    historyList.appendChild(historyItem);
}

// Crop Functionality
cropBtn.addEventListener("click", function () {
    cropping = !cropping;
    if (cropping) {
        cropStartX = cropStartY = 0;
        cropWidth = cropHeight = 0;
        imageCanvas.style.cursor = "crosshair";
    } else {
        imageCanvas.style.cursor = "default";
        ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        ctx.drawImage(img, 0, 0);
        ctx.strokeStyle = "red";
        ctx.strokeRect(cropStartX, cropStartY, cropWidth, cropHeight);
        addHistory("Crop applied");
    }
});

// Resize Functionality
resizeBtn.addEventListener("click", function () {
    const width = prompt("Enter new width:", img.width);
    const height = prompt("Enter new height:", img.height);
    if (width && height) {
        imageCanvas.width = width;
        imageCanvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        addHistory("Image resized");
    }
});

// Rotate Functionality
rotateBtn.addEventListener("click", function () {
    const angle = prompt("Enter angle to rotate (in degrees):");
    if (angle) {
        ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        ctx.save();
        ctx.translate(imageCanvas.width / 2, imageCanvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
        addHistory("Image rotated");
    }
});

// Flip Functionality
flipBtn.addEventListener("click", function () {
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(img, -img.width, 0);
    ctx.restore();
    addHistory("Image flipped");
});

// Image Adjustment Sliders
brightnessSlider.addEventListener("input", updateImageAdjustments);
contrastSlider.addEventListener("input", updateImageAdjustments);
saturationSlider.addEventListener("input", updateImageAdjustments);

function updateImageAdjustments() {
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    ctx.filter = `brightness(${brightnessSlider.value}) contrast(${contrastSlider.value}) saturate(${saturationSlider.value})`;
    ctx.drawImage(img, 0, 0);
}

// Reset Image
resetBtn.addEventListener("click", function () {
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    ctx.drawImage(img, 0, 0);
    addHistory("Image reset");
});

// Previous Button (Undo Last Action)
prevBtn.addEventListener("click", function () {
    if (history.length > 1) {
        history.pop(); // Remove the last action
        const lastAction = history[history.length - 1];
        alert("Undo: " + lastAction);
        // Reapply the previous state (you can improve this by managing image states)
    }
});

// Download Edited Image
downloadBtn.addEventListener("click", function () {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = imageCanvas.toDataURL();
    link.click();
});

// Merge Layers (Dummy example for now)
function mergeLayers() {
    if (layers.length > 1) {
        const mergedLayer = layers.join(" + ");
        layers = [mergedLayer]; // Merge all layers into one for simplicity
        alert("Layers merged into: " + mergedLayer);
    }
}
