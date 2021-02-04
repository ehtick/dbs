function onFileSelected() {
//  console.log('uploaded files: ', this.files);
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = content => {
    const arr = content.target.result;
    const base64 = arr.toString().split(',')[1];
    const decoded = atob(base64);
    console.log(decoded);
  };
  reader.readAsDataURL(file);
}
document.getElementById("uploadInput").addEventListener("change", onFileSelected, false);
