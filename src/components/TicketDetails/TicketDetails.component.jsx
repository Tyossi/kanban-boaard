import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIsSmall } from "../../hooks/utils";
import { ReactComponent as CloseIcon } from "../../assets/icons/cancel-icon.svg";
import { ReactComponent as ShareIcon } from "../../assets/icons/share-icon.svg";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Backdrop from "../Backdrop/Backdrop";
import "./ticketDetails.styles.css";

const api = "http://localhost:5000";

const TicketDetails = ({ endPoint }) => {
  const [singleTicket, setSingleTicket] = useState();
  const [copied, setCopied] = useState(false);
  const [descriptinInput, setDescriptionInput] = useState("");
  const [showForm, setShowForm] = useState(false);

  const copy = () => {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    toast.success("Copied To Clipboard!", {
      autoClose: 1500,
    });
  };

  const toggleShowForm = () => {
    if (singleTicket.ticketDescription) {
      setShowForm(!showForm);
    }
  };

  const isSmall = useIsSmall();

  const variants = isSmall
    ? {
        hidden: {
          width: "0rem",
          opacity: 0,
        },

        visible: {
          opacity: 1,
          width: "100vw",
          transition: { duration: 1 },
        },

        exit: {
          opacity: 0,
          width: "100vw",
          transition: { delay: 0.3, duration: 0.5, ease: "easeInOut" },
        },
      }
    : {
        hidden: {
          width: "0",
          opacity: 0,
        },

        visible: {
          opacity: 1,
          width: "70rem",
          transition: { duration: 1 },
        },

        exit: {
          opacity: 0,
          width: "-70rem",
          transition: { delay: 0.3, duration: 0.5, ease: "easeInOut" },
        },
      };

  const param = useParams();
  const navigate = useNavigate();

  const id = param.id;

  const getTicket = async () => {
    const response = await axios.get(`${api}/${endPoint}/${id}`);
    setSingleTicket(response.data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const description = {
      ticketDescription: descriptinInput,
    };

    if (descriptinInput !== "") {
      axios.put(`${api}/${endPoint}/${id}`, {
        ...singleTicket,
        ...description,
      });
      setTimeout(() => getTicket(), 1000);
    }
    setDescriptionInput("");
  };

  useEffect(() => {
    getTicket();
  }, []);

  return (
    <>
      <ToastContainer />
      <motion.div
        variants={variants}
        exit="exit"
        animate="visible"
        initial="hidden"
        className="ticket__details--container"
      >
        <div className="ticket__details--content">
          <span className="details-and-CTAs">
            <span className="ticket__text--content">
              <p>{singleTicket && singleTicket.ticketTitle}</p>
            </span>
            <span className="ticket__CTAs">
              <CloseIcon
                onClick={() => navigate(-1)}
                style={{ marginRight: "2.3rem" }}
              />
              <ShareIcon onClick={copy} />
            </span>
          </span>
          <h1>Description</h1>
          {singleTicket && singleTicket.ticketDescription ? (
            ""
          ) : (
            <form
              action=""
              onSubmit={handleSubmit}
              className="description__form"
            >
              <textarea
                type="text"
                value={descriptinInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                className="description__input"
              />
              {descriptinInput ? (
                <button type="submit" className="description__CTA">
                  submit
                </button>
              ) : (
                ""
              )}
            </form>
          )}
          <p onClick={toggleShowForm} className="description__text">
            {singleTicket && singleTicket.ticketDescription}
          </p>
        </div>
        <ToastContainer />
      </motion.div>

      <Backdrop />
    </>
  );
};

export default TicketDetails;
