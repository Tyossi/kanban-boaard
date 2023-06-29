import React, { useState, useEffect } from "react";
import TicketList from "../TicketList/TicketList.component";
import { AnimatePresence } from "framer-motion";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Outlet } from "react-router-dom";
import axios from "axios";
import "./main.styles.css";

const todoApi = "http://localhost:5000/todoTickets";
const onGoingApi = " http://localhost:5000/onGoingTickets";
const qualityAssuranceApi = " http://localhost:5000/qATickets";
const doneApi = " http://localhost:5000/doneTickets";

const Main = () => {
  const [todoTickets, setTodoTicket] = useState([]);

  const [ongoingTickets, setOngoingTicket] = useState([]);

  const [qualityAssurranceTickets, setQualityAssurranceTickets] = useState([]);

  const [doneTickets, setDoneTickets] = useState([]);

  const onDragEnd = (DropResult) => {
    const { source, destination } = DropResult;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let add,
      todo = todoTickets,
      onGoingTickets = ongoingTickets,
      qualityAssurance = qualityAssurranceTickets,
      done = doneTickets;

    if (source.droppableId === "todo__tickets") {
      add = todo[source.index];
      todo.splice(source.index, 1);
    } else if (source.droppableId === "onGoing__tickets") {
      add = onGoingTickets[source.index];
      onGoingTickets.splice(source.index, 1);
    } else if (source.droppableId === "QA__tickets") {
      add = qualityAssurance[source.index];
      qualityAssurance.splice(source.index, 1);
    } else if (source.droppableId === "done__tickets") {
      add = done[source.index];
      done.splice(source.index, 1);
    }

    if (destination.droppableId === "todo__tickets") {
      todo.splice(destination.index, 0, add);
    } else if (destination.droppableId === "onGoing__tickets") {
      onGoingTickets.splice(destination.index, 0, add);
    } else if (destination.droppableId === "QA__tickets") {
      qualityAssurance.splice(destination.index, 0, add);
    } else {
      done.splice(destination.index, 0, add);
    }

    setTodoTicket(todo);
    setOngoingTicket(onGoingTickets);
    setQualityAssurranceTickets(qualityAssurance);
    setDoneTickets(done);
  };

  const getTickets = async () => {
    const todoResult = await axios.get(todoApi);
    const onGoingResult = await axios.get(onGoingApi);
    const QAResult = await axios.get(qualityAssuranceApi);
    const doneTicketsApi = await axios.get(doneApi);

    setTodoTicket(todoResult.data);
    setOngoingTicket(onGoingResult.data);
    setQualityAssurranceTickets(QAResult.data);
    setDoneTickets(doneTicketsApi.data);
  };

  useEffect(() => {
    getTickets();
  }, []);

  return (
    <AnimatePresence exitBeforeEnter>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="main__container">
          <TicketList
            ticketListTitle="Todo"
            droppableId="todo__tickets"
            ticketState={todoTickets}
            setTicketState={setTodoTicket}
            endPoint="todoTickets"
            getTickets={getTickets}
            borderColor="red"
          />
          <TicketList
            ticketListTitle="OnGoing"
            ticketState={ongoingTickets}
            setTicketState={setOngoingTicket}
            droppableId="onGoing__tickets"
            endPoint="onGoingTickets"
            getTickets={getTickets}
            borderColor="yellow"
          />
          <TicketList
            ticketListTitle="QA"
            ticketState={qualityAssurranceTickets}
            setTicketState={setQualityAssurranceTickets}
            droppableId="QA__tickets"
            endPoint="qATickets"
            getTickets={getTickets}
            borderColor="blue"
          />
          <TicketList
            ticketListTitle="Done"
            ticketState={doneTickets}
            setTicketState={setDoneTickets}
            droppableId="done__tickets"
            endPoint="doneTickets"
            getTickets={getTickets}
            borderColor="green"
          />
          <Outlet />
        </div>
      </DragDropContext>
    </AnimatePresence>
  );
};

export default Main;
