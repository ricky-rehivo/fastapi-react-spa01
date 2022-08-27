/*
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


registerLocale("ja", ja)


export default function Calendar() {
    return (
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
                //events={events} // 起動時に登録するイベント
                //select={handleSelect} // カレンダー範囲選択時
                //eventClick={handleClick} // イベントクリック時
            />
    )
}

*/
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


export default function Calendar() {
    const [events, setEvents] = useState([]);
    const [eventId, setEventId] = useState("");
    const [inputEvent, setInputEvent] = useState([]);
    const [inputTitle, setInputTitle] = useState(""); // フォームに入力されたタイトル。
    const [inputStart, setInputStart] = useState(new Date); // イベントの開始時刻。
    const [inputEnd, setInputEnd] = useState(new Date); // イベントの終了時刻。

    const {isOpen, onOpen, onClose} = useDisclosure()

    const fetchEvents = async () => {
        const response = await fetch("http://localhost:8000/event");
        const events = await response.json();
        setEvents(events.data);
    };

    useEffect(() => {
        fetchEvents();
    }, [])

    function AddEventBtn() {
        return (
            <>
                <Stack>
                    <Button h="1.5rem" size="sm" onClick={onOpen}>新規予定</Button>
                </Stack>
                <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>新規予定</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <RenderForm />
                        </ModalBody>
                        <ModalFooter>
    
                        </ModalFooter>
                    </ModalContent>`
                </Modal>
            </>
        );
    };
    
    function handleSelect(selectinfo) {
        const start = new Date(selectinfo.start);
        const end = new Date(selectinfo.end);
        start.setHours(start.getHours());
        end.setHours(end.getHours());

        setInputTitle("");
        setInputStart(start);
        setInputEnd(end);
    };


    function handleClick(info) {
        setEventId(info.event.id);
        setInputEvent(events[eventId]);
        setInputTitle(inputEvent.title);
        setInputStart(inputEvent.start);
        setInputEnd(inputEvent.end);
    };
    
    
    function RenderForm() {
        function RenderTitle() {
            const handleChange = (event) => {
                console.log('input title log BEFORE')
                setInputTitle(event.target.value)
                console.log('input title log AFTER')
            }
            return (
                <>
                    <Text>タイトル</Text>
                    <InputGroup size="sm">
                        <Input
                            type="text"
                            value={inputTitle}
                            name="inputTitle"
                            onChange={handleChange}
                        />
                    </InputGroup>
                </>
            );
        }

        function RenderStartTime() {
            const handleChange = (event) => {
                setInputStart(event)
            }
            return (
                <>
                    <InputGroup>
                        <Text>開始</Text>
                        <DatePicker
                            locale='ja'
                            dateFormat="yyyy/MM/d HH:mm"
                            selected={inputStart}
                            //onChange={handleChange}
                        />
                    </InputGroup>
                </>
            );
        }

        function RenderEndTime() {
            const handleChange = (event) => {
                setInputEnd(event)
            }
            return (
                <div>
                    <label>終了</label>
                    <DatePicker
                        locale="ja"
                        dateFormat="yyyy/MM/d HH:mm"
                        selected={inputEnd}
                        onChange={handleChange}
                    />
                </div>
            );
        };

        function RenderBtn() {
            return (
                <div>
                    This is the button.
                </div>
            );
        };

        return (
            <>
                <RenderTitle />
                <RenderStartTime />
                <RenderEndTime />
                <RenderBtn />
            </>
        );
    }
    
    return (
        <>
            <AddEventBtn />
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
                //events={events} // 起動時に登録するイベント
                //select={handleSelect} // カレンダー範囲選択時
                //eventClick={handleClick} // イベントクリック時
            />
        </>
    )
}





/*
function AddEvent() {
    return (
        <Button h="1.5rem" size="sm" onClick={ShowForm}>新規予定を作成</Button>
    )
}

const btnElement = (
    <div>
        <Button h="1.5rem" size="sm" onClick={onClose}>キャンセル</Button>
        <Button h="1.5rem" size="sm" onClick={OnAddEvent}>保存</Button>
    </div>
)

function AddEvent (id, title, startTime, endTime) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    function OnAddEvent() {
        if (startTime >= endTime) {
            alert("開始時間と終了時間を確認してください。");
            return;
        }
        if (startTime === null | endTime === null | title === null) {
            alert("すべての項目に入力してください。");
            return;
        }
        if (id === null) {
            id = Calendar.events.length
        }
        const newEvent ={
            id: id,
            title: title,
            start: startTime,
            end: endTime
        }

        fetch("http://localhost:8000/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEvent)
        }).then(Calendar.fetchEvents);
    }

    const btnElement = (
    <div>
        <Button h="1.5rem" size="sm" onClick={onClose}>キャンセル</Button>
        <Button h="1.5rem" size="sm" onClick={OnAddEvent}>保存</Button>
    </div>


    */

    /*
    locale="ja"
    dateFormat="yyyy/MM/d HH:mm"
    selected={Calendar.inputEnd}
    showTimeSelect
    timeFormat="HH:mm"
    timeIntervals={10}
    todayButton="today"
    name="inputEnd"
    onChange={(time) => Calendar.setInputEnd(time)}
    */
/*



    return (
        <div>
            <Button h="1.5rem" size="sm" onClick={onOpen}>予定を入力</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay>
                <ModalContent>
                    <ModalHeader>予定を入力</ModalHeader>
                    <ModalBody>
                        {formElement}
                    </ModalBody>
                </ModalContent>
            </ModalOverlay>
            </Modal>
        </div>
    );
}
*/