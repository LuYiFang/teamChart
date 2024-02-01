import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import withReactContent, {
  ReactSweetAlertOptions,
} from "sweetalert2-react-content";
import "./style.css";
import { SingleDialog } from "../Dialogs/ChainDialog";
import { Backdrop } from "@mui/material";
import _ from "lodash";

export class Alert {
  static swal = withReactContent(Swal);

  static async error(msg = "", title = "") {
    this.swal.fire({
      title: title ? title : "Error!",
      text: msg,
      icon: "error",
      confirmButtonText: "OK",
    });
  }

  static async warning(msg = "", title = "") {
    this.swal.fire({
      title: title ? title : "Warning!",
      text: msg,
      icon: "warning",
      confirmButtonText: "OK",
    });
  }

  static async success(msg = "", title = "") {
    this.swal.fire({
      title: title ? title : "Success!",
      text: msg,
      icon: "success",
      confirmButtonText: "OK",
    });
  }

  static delay = () => {
    return new Promise((reslove) => setTimeout(reslove, 50));
  };

  static async chainOfCalls(msg = "", title = "") {
    const chainCallId = "chain-calls";

    // close existing swal
    this.swal.fire({
      showConfirmButton: false,
      timer: 1,
    });

    let domNode = document.getElementById(chainCallId);
    if (domNode) {
      domNode.innerHTML = "";
    } else {
      domNode = document.createElement("div");
      domNode.id = chainCallId;
    }

    const root = createRoot(domNode);

    for (let i = 0; i < 9; i++) {
      root.render(
        <div className="chain">
          {_.map(_.range(i + 1), (_i) => {
            if (_i === 0) {
              return (
                <Backdrop
                  open={true}
                  sx={{ zIndex: (theme) => theme.zIndex.drawer + 3 }}
                />
              );
            }
            return (
              <SingleDialog
                key={`chain-dialog-${_i}`}
                title={title}
                msg={msg}
                index={`${_i}`}
                onClose={() => {
                  root.unmount();
                  domNode?.remove();
                }}
              />
            );
          })}
        </div>,
      );
      document.body.appendChild(domNode);

      await Alert.delay();
    }
  }
}
