export const downloadZip = (compressedZipFile: Blob) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(compressedZipFile);
  downloadLink.download = "export.zip";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
