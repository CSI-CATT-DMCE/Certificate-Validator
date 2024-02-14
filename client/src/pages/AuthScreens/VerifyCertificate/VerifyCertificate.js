import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthCertificate } from "../../../utils/Certificate";
import { StateContext } from "../../../context/StateContext";
import Certificate from "../../../assets/certificate.png";
import dayjs from "dayjs";
import QRCode from "react-qr-code";

const VerifyCertificate = () => {
  const { uid } = useParams();
  const { toggleLoading } = useContext(StateContext);

  const [certificateData, setCertificateData] = useState(null);
  const qr_code = useRef(null);
  const url = useRef(
    `${window.location.origin}/verify-certificate/${uid}`
  );

  useEffect(() => {
    const controller = new AbortController();
    AuthCertificate(controller, uid, toggleLoading, setCertificateData);
    return () => controller.abort();
  }, [uid]);

  const getPositionText = (position) => {
    if (position === 0) {
      return "participation";
    } else if (position === 1) {
      return "1st";
    } else if (position === 2) {
      return "2nd";
    } else if (position === 3) {
      return "3rd";
    } else {
      return "";
    }
  };

  return (
    <div className="auth-certi">
      {certificateData && (
        <div className="certificate">
          <img src={Certificate} alt="" className="img-fluid" />
          <p
            id="title"
            style={{
              fontSize: `min(4vw, 45px)`,
            }}
          >
            Certificate of{" "}
            {certificateData?.position === 0 ? "Participation" : "Achievement"}
          </p>
          <p id="name">{certificateData?.name}</p>
          {certificateData?.position === 0 ? (
            <p id="desc">
              for participation in the <b>{certificateData?.event_id}</b>{" "}
              organized by CSI DMCE on{" "}
              {dayjs(certificateData?.date).format("DD MMMM YYYY")}, at Datta
              Meghe College of Engineering, Airoli.
            </p>
          ) : (
            <p id="desc">
              for achieving the{" "}
              <b>{getPositionText(certificateData?.position)} position</b> at{" "}
              <b>{certificateData?.event}</b> organized by CSI DMCE on{" "}
              {dayjs(certificateData?.date).format("DD MMMM YYYY")}, at Datta
              Meghe College of Engineering, Airoli.
            </p>
          )}
          <p id="uid">Certificate ID : {certificateData?.uid}</p>
          <div
            className="ms-md-3 mt-4 mt-md-0 p-md-2"
            ref={qr_code}
            style={{
              width: "100%",
              maxWidth: "200px",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <QRCode
              size={200} // Adjust the size as needed
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={url.current || ""}
              viewBox={`0 0 200 200`} // Adjust the viewBox dimensions
            />

            <h6 className="mt-2 text-center">{uid}</h6>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
