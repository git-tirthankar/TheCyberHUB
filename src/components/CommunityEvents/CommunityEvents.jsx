import React, { useEffect, useState } from "react";
import {
    ParentContainer,
    Container,
    Header,
    SubHeader,
    Tabs,
    NoDataComponent,
    EventList,
    EventNote,
    CommunityEventHeaderContainer,
} from "./CommunityEventsElement";
import NoDataFound from "../../assets/images/no_data_found.svg";
import { EventItemList } from "./EventItemList";
import { RouterNavCreateButton } from "../Header/Navbar/NavbarElements";
import ModifyCommunityEvent from "./ModifyCommunityEvent";

const getTimeRelatedData = () => {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
        today.getDate(),
    ).padStart(2, "0")}`;

    const currentTime = `${today.getHours()}:${today.getMinutes()}`;

    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

    return [todayString, currentTime, daysOfWeek];
};

const CommunityEvents = ({
    events,
    pageHeader,
    title,
    subtitle,
    modify,
    actions = [],
    eventsJoinedId = [],
    user,
    onActionChange = () => {},
    modifyEventId,
    setModifyEventId,
}) => {
    const [isActiveTab, setActiveTab] = useState(0);
    const [openCreatingNewEvent, setOpenCreatingNewEvent] = useState(false);

    const tabNames = [
        { id: 0, status: "upcoming" },
        { id: 1, status: "past" },
        { id: 2, status: "cancelled" },
    ];
    const [todayString, currentTime, daysOfWeek] = getTimeRelatedData();

    const filteredEvents = events
        .filter((event) => {
            let eventFit = false;
            switch (tabNames[isActiveTab].status) {
                case "cancelled":
                    if (event.status === tabNames[isActiveTab].status) eventFit = true;
                    break;
                case "past":
                    if (
                        event.status === "approved" &&
                        (event.date < todayString || (event.date === todayString && event.endTime < currentTime))
                    )
                        eventFit = true;
                    break;
                case "upcoming":
                    if (
                        event.status === "approved" &&
                        (event.date > todayString || (event.date === todayString && event.endTime >= currentTime))
                    )
                        eventFit = true;
                    break;
                default:
                    eventFit = false;
            }
            return eventFit;
        })
        .sort((a, b) => {
            return a.date < b.date || (a.date === b.date && a.startTime < b.startTime);
        });

    const handleModifyEvent = (newEvent, eventId = "") => {
        if (!eventId) return events.push(newEvent);
        const modifiedEventIndex = events.findIndex((event) => event._id === eventId);
        events[modifiedEventIndex] = { ...events[modifiedEventIndex], ...newEvent };
        setModifyEventId("");
    };
    useEffect(() => {
        setOpenCreatingNewEvent(modifyEventId);
        if (modifyEventId) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }
    }, [modifyEventId]);

    return (
        <ParentContainer pageHeader={pageHeader}>
            <Container>
                <Header>{title}</Header>
                <SubHeader>{subtitle}</SubHeader>
                <CommunityEventHeaderContainer>
                    <Tabs>
                        {tabNames.map((tab, index) => (
                            <button
                                onClick={() => setActiveTab(index)}
                                key={tab.id}
                                className={isActiveTab === index ? "active" : ""}
                            >
                                {tab.status}
                            </button>
                        ))}
                    </Tabs>
                    {modify && (
                        <RouterNavCreateButton noCenter onClick={() => setOpenCreatingNewEvent(true)}>
                            Create Event
                        </RouterNavCreateButton>
                    )}
                </CommunityEventHeaderContainer>

                <EventList>
                    {modify && openCreatingNewEvent && (
                        <ModifyCommunityEvent
                            setOpenCreatingNewEvent={setOpenCreatingNewEvent}
                            onModify={handleModifyEvent}
                            modifyEvent={events.find((event) => event._id === modifyEventId)}
                            setModifyEventId={setModifyEventId}
                            modifyEventId={modifyEventId}
                        />
                    )}
                    {filteredEvents.length !== 0 ? (
                        filteredEvents.map((data, index) => {
                            const dateObject = new Date(data.date);
                            const dayName = daysOfWeek[dateObject.getDay()];
                            return (
                                <EventItemList
                                    data={data}
                                    todayString={todayString}
                                    currentTime={currentTime}
                                    dayName={dayName}
                                    actions={actions}
                                    key={index}
                                    index={index}
                                    modify={modify}
                                    eventsJoinedId={eventsJoinedId}
                                    user={user}
                                    onActionChange={onActionChange}
                                    tabStatus={tabNames[isActiveTab].status}
                                />
                            );
                        })
                    ) : (
                        <NoDataComponent>
                            <h2>There is no {tabNames[isActiveTab].status} event right now.</h2>
                            <img src={NoDataFound} alt="No data found" />
                        </NoDataComponent>
                    )}
                </EventList>
                {!modify && !user && (
                    <EventNote>* To Join An Event You First Need To Login/Register To The Website</EventNote>
                )}
            </Container>
        </ParentContainer>
    );
};

export default CommunityEvents;
