import React, { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja"
import "react-datepicker/dist/react-datepicker.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    InputRightAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure
} from "@chakra-ui/react";

registerLocale("ja", ja)


const EventsContext = React.createContext({
events: [], fetchEvents: () => {}
});



let numberDeletedEvents = 0;

export default function Calendar() {
    
    const [events, setEvents] = useState([]);
    const [eventId, setEventId] = useState("");
    const [inputEvent, setInputEvent] = useState({});
    const [inputTitle, setInputTitle] = useState(""); // フォームに入力されたタイトル。
    const [inputStart, setInputStart] = useState(new Date); // イベントの開始時刻。
    const [inputEnd, setInputEnd] = useState(new Date); // イベントの終了時刻。
    const [isUpdate, setIsUpdate] = useState(false);

    const {isOpen, onOpen, onClose} = useDisclosure()

    const fetchEvents = async () => {
        const response = await fetch("http://localhost:8000/event");
        const events = await response.json();
        setEvents(events.data);
    };

    useEffect(() => {
        fetchEvents();
    }, [])

    const handleSelect = (selectinfo) => {
        const start = new Date(selectinfo.start);
        const end = new Date(selectinfo.end);
        start.setHours(start.getHours());
        end.setHours(end.getHours());

        setInputTitle("");
        setInputStart(start);
        setInputEnd(end);
    };


    const handleClick = (info) => {

        setEventId(info.event.id);
        setInputTitle(info.event.title);
        setInputStart(info.event.start);
        setInputEnd(info.event.end);
        setIsUpdate(true);
        onOpen();
    };

    const addEvent = () => {
        const newEvent = {
            "id": events.length + numberDeletedEvents,
            "title": inputTitle,
            "start": inputStart,
            "end": inputEnd
        }
        fetch("http://localhost:8000/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent)
        }).then(fetchEvents);
        onClose();
    }

    const updateEvent = () => {
        const newEvent = {
            "id": eventId,
            "title": inputTitle,
            "start": inputStart,
            "end": inputEnd
        }

        fetch(`http://localhost:8000/event/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent)
        }).then(fetchEvents);
        onClose();
        cancelRefresh();
    }

    const deleteEvent = () => {
        fetch(`http://localhost:8000/event/${eventId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: { "id": eventId }
        }).then(fetchEvents);
        onClose();
        cancelRefresh();
        numberDeletedEvents++;
    };


    const titleElement = (
        <>
            <Text>タイトル</Text>
            <InputGroup>
                <Input
                    type="text"
                    value={inputTitle}
                    name="inputTitle"
                    onChange={event => setInputTitle(event.target.value)}
                />
            </InputGroup>
        </>
    )

    const startTimeElement = (
        <>
            <InputGroup>
                <Text>開始</Text>
                <DatePicker
                    locale='ja'
                    dateFormat="yyyy/MM/d HH:mm"
                    selected={inputStart}
                    onChange={event => setInputStart(event)}
                />
            </InputGroup>
        </>
    )

    const endTimeElement = (
        <>
        <InputGroup>
            <Text>終了</Text>
            <DatePicker
                locale="ja"
                dateFormat="yyyy/MM/d HH:mm"
                selected={inputEnd}
                onChange={event => setInputEnd(event)}
            />
        </InputGroup>
        </>
    )

    const cancelRefresh = () => {
        console.log("cancelRefresh called!")
        setInputTitle("");
        setInputStart(new Date);
        setInputEnd(new Date);
        setIsUpdate(false)
        onClose();
    }

    const BtnElement = () => {
        if (isUpdate) {
            return (
                <>
                <InputGroup>
                    <Button h="1.5rem" size="sm" onClick={cancelRefresh}>キャンセル</Button>
                    <Button h="1.5rem" size="sm" onClick={updateEvent}>更新</Button>
                    <Button h="1.5rem" size="sm" onClick={deleteEvent}>削除</Button>
                    </InputGroup>
                </>
        );} else {
            return (
                <>
                    <Button h="1.5rem" size="sm" onClick={onClose}>キャンセル</Button>
                    <Button h="1.5rem" size="sm" onClick={addEvent}>保存</Button>
                </>
            )
        }
    }



    const renderForm = (
        <>
            <Stack>
                <Button h="1.5rem" size="sm" onClick={onOpen}>新規予定</Button>
            </Stack>
            <Modal isOpen={isOpen} onClose={cancelRefresh}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>新規予定</ModalHeader>
                    <ModalBody>
                        {titleElement}
                        {startTimeElement}
                        {endTimeElement}
                        <BtnElement />
                    </ModalBody>
                    <ModalFooter>

                    </ModalFooter>
                </ModalContent>`
            </Modal>
        </>
    );

    return (
        <>
            {renderForm}
            <FullCalendar
                locale="ja" // 日本語
                initialView="dayGridMonth" // 基本UI
                slotDuration="00:30:00" // 表示する時間軸の最小値
                selectable={true} // 日付選択可能
                allDaySlot={false} // alldayの表示設定
                titleFormat={{
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }} // タイトルに年月日を表示
                headerToolbar={{
                    left: "prev,next,today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek",
                }}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: "0:00",
                    endTime: "24:00",
                }}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                //ref={ref}
                weekends={true} // 週末表示
                events={events} // 起動時に登録するイベント
                select={handleSelect} // カレンダー範囲選択時
                eventClick={handleClick} // イベントクリック時
            />
        </>
    )
}