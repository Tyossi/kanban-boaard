import React, { useState } from "react";
import { ReactComponent as EditIcon } from "../../assets/icons/edit-icon.svg";
import { ReactComponent as DeleteIcon } from "../../assets/icons/delete-icon.svg";
import { ReactComponent as ViewIcon } from "../../assets/icons/view-icon.svg";
import { ReactComponent as CheckMarkIcon } from "../../assets/icons/checkmark-icon.svg";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ticket.styles.css";

const Ticket = ({
  ticket,
  ticketState,
  setTicketState,
  endPoint,
  getTickets,
  ticketKey,
}) => {
  const [editTicket, setEditTicket] = useState(ticket);
  const [edit, setEdit] = useState(false);

  const api = "http://localhost:5000";

  const deleteTicket = async (key) => {
    if (window.confirm("Are you sure you want to delete ticket?")) {
      axios.delete(`${api}/${endPoint}/${ticketKey}`);
      setTimeout(() => getTickets(), 500);
    }
    setTicketState(ticketState.filter((ticket) => ticket.key !== key));
  };

  const handleEdit = (key) => {
    setEdit(!edit);
    setTicketState(
      ticketState.map((ticket) =>
        ticket.key === key ? { ...ticket, ticketTitle: editTicket } : ticket
      )
    );
    axios.put(`${api}/${endPoint}/${key}`, { ticketTitle: editTicket });
    setTimeout(() => getTickets(), 500);
  };

  return (
    <div className="ticket__container">
      {edit ? (
        <input
          type="text"
          value={editTicket}
          onChange={(e) => setEditTicket(e.target.value)}
          className="edit__input"
        />
      ) : (
        <p className="ticket__text">{ticket}</p>
      )}

      <span className="edit-and-delete">
        <div className="ticket__CTA">
          {!edit ? (
            <EditIcon onClick={() => setEdit(!edit)} />
          ) : (
            <CheckMarkIcon onClick={() => handleEdit(ticketKey)} />
          )}
        </div>
        <div className="ticket__CTA" onClick={() => deleteTicket(ticketKey)}>
          <DeleteIcon />
        </div>
        <Link to={`/${endPoint}/${ticketKey}`}>
          <div className="ticket__CTA">
            <ViewIcon />
          </div>
        </Link>
      </span>
    </div>
  );
};

export default Ticket;
