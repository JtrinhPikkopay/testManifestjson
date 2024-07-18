import * as SDCCore from "scandit-web-datacapture-core";
import * as SDCBarcode from "scandit-web-datacapture-barcode";
import { useEffect, useRef, useState } from "react";
import { SCANDIT_LIBRARY_LOCATION, SCANDIT_LICENSE_KEY } from "./keys";
import { Button } from "@mui/material";

// globals
let camera = null;
let view = null;
let barcodeCapture = null;

const Scanner = ({ onScanComplete, scanAgain }) => {
  //   ref
  const viewRef = useRef(null);

  // state
  const [isScanAgainDisabled, setIsScanAgainDisabled] = useState(true);

  useEffect(() => {
    if (viewRef.current) {
      runScanner();
    }
    return () => {
      if (view) {
        view.detachFromElement();
      }
      if (camera) {
        camera.switchToDesiredState(SDCCore.FrameSourceState.Off);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewRef]);

  //   initialize scanner
  const runScanner = async () => {
    await SDCCore.configure({
      licenseKey: SCANDIT_LICENSE_KEY,
      libraryLocation: SCANDIT_LIBRARY_LOCATION,
      moduleLoaders: [SDCBarcode.barcodeCaptureLoader()],
    });

    const context = await SDCCore.DataCaptureContext.create();

    camera = await SDCCore.Camera.default;
    const cameraSettings = SDCBarcode.BarcodeTracking.recommendedCameraSettings;
    await camera.applySettings(cameraSettings);
    await context.setFrameSource(camera);

    const settings = new SDCBarcode.BarcodeCaptureSettings();
    settings.enableSymbologies([
      SDCBarcode.Symbology.Code128,
      SDCBarcode.Symbology.Code39,
      SDCBarcode.Symbology.QR,
      SDCBarcode.Symbology.EAN8,
      SDCBarcode.Symbology.UPCE,
      SDCBarcode.Symbology.EAN13UPCA,
    ]);

    const symbologySettings = settings.settingsForSymbology(
      SDCBarcode.Symbology.Code39
    );
    symbologySettings.activeSymbolCounts = [
      7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];

    barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(
      context,
      settings
    );
    await barcodeCapture.setEnabled(false);

    view = await SDCCore.DataCaptureView.forContext(context);

    view.connectToElement(viewRef.current);
    view.addControl(new SDCCore.CameraSwitchControl());

    view.showProgressBar();
    view.setProgressBarMessage("Loading...");

    const barcodeCaptureOverlay =
      await SDCBarcode.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
        barcodeCapture,
        view,
        SDCBarcode.BarcodeCaptureOverlayStyle.Frame
      );

    const viewfinder = new SDCCore.RectangularViewfinder(
      SDCCore.RectangularViewfinderStyle.Square,
      SDCCore.RectangularViewfinderLineStyle.Light
    );

    await barcodeCaptureOverlay.setViewfinder(viewfinder);

    await camera.switchToDesiredState(SDCCore.FrameSourceState.On);
    await barcodeCapture.setEnabled(true);

    view.hideProgressBar();

    barcodeCapture.addListener({
      didScan: async (barcodeCapture, session) => {
        // disable barcode capture after scan
        await barcodeCapture.setEnabled(false);
        const barcode = session.newlyRecognizedBarcodes[0];
        const symbology = new SDCBarcode.SymbologyDescription(
          barcode.symbology
        );
        showResult(barcode.data, symbology.readableName);
      },
    });
  };

  //   callback after scan
  const showResult = async (data, symbology) => {
    onScanComplete(data);
    setIsScanAgainDisabled(false);

    // handleHideScanner();
  };

  // hide scanner
  const handleHideScanner = () => {
    camera?.switchToDesiredState(SDCCore.FrameSourceState.Off);
    view?.detachFromElement();
  };

  const handleScanAgain = async () => {
    if (camera && view && barcodeCapture) {
      await view.connectToElement(viewRef.current);
      await camera?.switchToDesiredState(SDCCore.FrameSourceState.On);
      await barcodeCapture?.setEnabled(true);
      setIsScanAgainDisabled(true);
    }
  };

  return (
    <div>
      <div ref={viewRef} className="w-full max-w-[500px] h-[300px]" />
      {scanAgain && (
        <Button
          variant="contained"
          fullWidth
          disableElevation
          onClick={handleScanAgain}
          disabled={isScanAgainDisabled}
          className="mt-4"
        >
          {isScanAgainDisabled ? "Scanning..." : "Scan again"}
        </Button>
      )}
    </div>
  );
};

export default Scanner;
