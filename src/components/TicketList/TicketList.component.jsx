import React, { useState } from "react";
import Ticket from "../Ticket/Ticket.component";
import "./ticketList.styles.css";
import { Droppable } from "react-beautiful-dnd";
import axios from "axios";
import { Draggable } from "react-beautiful-dnd";

const TicketList = ({
  ticketListTitle,
  ticketState,
  setTicketState,
  droppableId,
  endPoint,
  getTickets,
  borderColor,
}) => {
  const [ticketInput, setTicketInput] = useState("");

  const [showInputField, setshowInputField] = useState(false);

  const api = `http://localhost:5000/${endPoint}`;

  const handleInputOnChange = (e) => {
    e.target.value ? setTicketInput(e.target.value) : setTicketInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const uniqueKey = Date.now();
    const newTicket = {
      key: uniqueKey,
      ticketTitle: ticketInput,
    };

    if (ticketInput !== "") {
      axios.post(api, newTicket);
      setTimeout(() => getTickets(), 500);
    }
    setTicketInput("");
    toggleInputVisibility();
  };

  const toggleInputVisibility = () => {
    setshowInputField(!showInputField);
  };

  return (
    <>
      <div className="ticketLists__container">
        <Droppable droppableId={`${droppableId}`}>
          {(provided) => (
            <div
              className="ticket__list todo__ticketList"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <span
                className="ticketList__heading"
                style={{ borderBottom: `3px solid ${borderColor}` }}
              >
                <h3>{ticketListTitle}</h3>
                <p>{ticketState.length}</p>
              </span>
              {showInputField ? (
                <>
                  <form action="" onSubmit={(e) => handleSubmit(e)}>
                    <input
                      type="text"
                      onChange={handleInputOnChange}
                      className="ticket__input"
                    />
                    <button type="submit" className="submit__ticket--CTA">
                      submit
                    </button>
                  </form>
                </>
              ) : (
                <button
                  className="addTicket__CTA"
                  onClick={toggleInputVisibility}
                >
                  + Add Ticket...
                </button>
              )}

              {ticketState.map((ticket, index) => {
                return (
                  <Draggable
                    key={ticket.key}
                    draggableId={ticket.key.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                      >
                        <Ticket
                          key={ticket.id}
                          ticket={ticket.ticketTitle}
                          ticketId={ticket.id}
                          ticketKey={ticket.key}
                          index={index}
                          ticketState={ticketState}
                          setTicketState={setTicketState}
                          endPoint={endPoint}
                          getTickets={getTickets}
                        />
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </>
  );
};

export default TicketList;
