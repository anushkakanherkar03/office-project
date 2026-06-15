const startCamera = async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera not supported in this browser");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;

      await videoRef.current.play().catch(() => {});
    }

    setCapturing(true);
  } catch (error) {
    console.log(error);

    if (error.name === "NotAllowedError") {
      alert("Camera permission denied");
    } else if (error.name === "NotFoundError") {
      alert("No camera device found");
    } else {
      alert("Camera not available in this environment");
    }
  }
};