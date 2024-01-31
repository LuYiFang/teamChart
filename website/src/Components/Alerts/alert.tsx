import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import withReactContent, {
  ReactSweetAlertOptions,
} from "sweetalert2-react-content";
import "./style.css";
import ChainDialog from "../Dialogs/ChainDialog";

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

  static async chainOfCalls(msg = "", title = "") {
    const domNode = document.createElement("div");
    let root = createRoot(domNode);
    root.render(
      <ChainDialog
        onClose={() => {
          root.unmount();
        }}
      />,
    );
    document.body.appendChild(domNode);
  }
}
