export default class FileLoaderControl {
  constructor(fileLoaderElt, loadCb) {
    this.fileLoaderElt = fileLoaderElt;
    this.fileLoaderElt.addEventListener('change', () => {
        this.onFileSelected();
      }, false);
    this.loadCb = loadCb;
  }


  onFileSelected() {
    const file = this.fileLoaderElt.files[0];
    const reader = new FileReader();
    reader.onload = content => {
      const arr = content.target.result;
      const base64 = arr.toString().split(',')[1];
      const decoded = atob(base64);
      this.loadCb(decoded);
    };
    reader.readAsDataURL(file);
  }
}
